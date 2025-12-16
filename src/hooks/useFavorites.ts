import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Initialize from localStorage for non-authenticated users
    const stored = localStorage.getItem("animal-favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch favorites from database when user is authenticated
  const fetchFavorites = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('animal_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        return;
      }

      const dbFavorites = data?.map(f => f.animal_id) || [];
      setFavorites(dbFavorites);
      // Sync to localStorage as backup
      localStorage.setItem("animal-favorites", JSON.stringify(dbFavorites));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Sync localStorage favorites to database when user logs in
  const syncLocalFavoritesToDb = useCallback(async () => {
    if (!user?.id) return;
    
    const localFavorites = localStorage.getItem("animal-favorites");
    if (!localFavorites) return;
    
    const favoritesToSync = JSON.parse(localFavorites) as string[];
    if (favoritesToSync.length === 0) return;

    // Get existing favorites from DB
    const { data: existingFavorites } = await supabase
      .from('user_favorites')
      .select('animal_id')
      .eq('user_id', user.id);

    const existingIds = new Set(existingFavorites?.map(f => f.animal_id) || []);
    
    // Filter out duplicates
    const newFavorites = favoritesToSync.filter(id => !existingIds.has(id));
    
    if (newFavorites.length > 0) {
      const { error } = await supabase
        .from('user_favorites')
        .insert(newFavorites.map(animal_id => ({
          user_id: user.id,
          animal_id
        })));

      if (error) {
        console.error('Error syncing favorites:', error);
      }
    }
  }, [user?.id]);

  // Load favorites when auth state changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // First sync any local favorites, then fetch all from DB
      syncLocalFavoritesToDb().then(() => {
        fetchFavorites();
      });
    }
  }, [isAuthenticated, user?.id, fetchFavorites, syncLocalFavoritesToDb]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("animal-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated]);

  const toggleFavorite = async (id: string) => {
    const isFav = favorites.includes(id);
    
    // Optimistically update UI
    setFavorites((prev) =>
      isFav ? prev.filter((fav) => fav !== id) : [...prev, id]
    );

    if (isAuthenticated && user?.id) {
      try {
        if (isFav) {
          // Remove from database
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('animal_id', id);

          if (error) throw error;
        } else {
          // Add to database
          const { error } = await supabase
            .from('user_favorites')
            .insert({ user_id: user.id, animal_id: id });

          if (error) throw error;
        }
      } catch (error) {
        // Revert on error
        setFavorites((prev) =>
          isFav ? [...prev, id] : prev.filter((fav) => fav !== id)
        );
        toast({
          title: "Error",
          description: "Failed to update favorites. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite, isLoading, refetch: fetchFavorites };
};
