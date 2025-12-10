import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { PawPrint } from "lucide-react";
import { animals, Animal } from "@/data/mockData";
import { AnimalCard } from "@/components/animals/AnimalCard";
import { AnimalFilters, AnimalFiltersSidebar } from "@/components/animals/AnimalFilters";
import { QuickViewModal } from "@/components/animals/QuickViewModal";
import { useFavorites } from "@/hooks/useFavorites";

const Animals = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quickViewAnimal, setQuickViewAnimal] = useState<Animal | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    species: [] as string[],
    size: [] as string[],
    status: [] as string[],
    sortBy: "name",
  });

  const filteredAnimals = useMemo(() => {
    let result = [...animals];

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (animal) =>
          animal.name.toLowerCase().includes(query) ||
          animal.breed.toLowerCase().includes(query) ||
          animal.species.toLowerCase().includes(query)
      );
    }

    // Species filter
    if (filters.species.length > 0) {
      result = result.filter((animal) => filters.species.includes(animal.species));
    }

    // Size filter
    if (filters.size.length > 0) {
      result = result.filter((animal) => filters.size.includes(animal.size));
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter((animal) => filters.status.includes(animal.status));
    }

    // Sorting
    switch (filters.sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "age-asc":
        result.sort((a, b) => a.ageNumber - b.ageNumber);
        break;
      case "age-desc":
        result.sort((a, b) => b.ageNumber - a.ageNumber);
        break;
      case "arrival":
        result.sort((a, b) => new Date(b.arrivalDate).getTime() - new Date(a.arrivalDate).getTime());
        break;
    }

    return result;
  }, [filters]);

  return (
    <Layout>
      <section className="relative bg-gradient-to-br from-sage-light/30 via-background to-amber-light/20 section-padding">
        <div className="container-app">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <PawPrint className="h-4 w-4" />
              <span>Our Animals</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-gradient">Furry Friends</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Each of our animals has a unique story and personality. Find your perfect match for therapy, adoption, or companionship.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-app">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <AnimalFiltersSidebar filters={filters} onFiltersChange={setFilters} />

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile/Tablet Search and Filters */}
              <div className="lg:hidden mb-6">
                <AnimalFilters filters={filters} onFiltersChange={setFilters} />
              </div>

              {/* Results Count and Desktop Sort */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {filteredAnimals.length} animal{filteredAnimals.length !== 1 ? "s" : ""} found
                </p>
                <AnimalFilters filters={filters} onFiltersChange={setFilters} />
              </div>

              {/* Mobile Results Count */}
              <p className="lg:hidden text-muted-foreground mb-4">
                {filteredAnimals.length} animal{filteredAnimals.length !== 1 ? "s" : ""} found
              </p>

              {/* Animals Grid */}
              {filteredAnimals.length === 0 ? (
                <div className="text-center py-12">
                  <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold mb-2">No animals found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAnimals.map((animal) => (
                    <AnimalCard
                      key={animal.id}
                      animal={animal}
                      isFavorite={isFavorite(animal.id)}
                      onToggleFavorite={toggleFavorite}
                      onQuickView={setQuickViewAnimal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        animal={quickViewAnimal}
        isOpen={!!quickViewAnimal}
        onClose={() => setQuickViewAnimal(null)}
        isFavorite={quickViewAnimal ? isFavorite(quickViewAnimal.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </Layout>
  );
};

export default Animals;
