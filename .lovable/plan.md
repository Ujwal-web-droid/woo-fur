

## Plan: Database se Demo Animals Hatao aur Auto-Refresh Add Karo

### Step 1: Database se saare demo animals delete karo
Database mein abhi 6 AI-generated demo animals hain (Luna, Max, Coco, Daisy, Oliver, Whiskers). Ye saare delete kar diye jayenge database migration ke through.

### Step 2: Auto-refresh har 1 minute mein add karo
`useAnimals`, `useAnimal`, aur `useAnimalSearch` hooks mein `refetchInterval: 60000` (60 seconds) add karenge. Isse animals ka data har 1 minute mein automatically refresh hoga bina page reload kiye.

---

### Technical Details

**Database Migration:**
```sql
DELETE FROM animals;
```
Ye saare existing demo animals ko hata dega.

**File Changes - `src/hooks/useAnimals.ts`:**
- `useAnimals()` hook mein `refetchInterval: 60000` add karenge
- `useAnimal()` hook mein bhi `refetchInterval: 60000` add karenge  
- `useAnimalSearch()` hook mein bhi `refetchInterval: 60000` add karenge

Isse jab admin panel se naye real animals add kiye jayenge toh wo automatically 1 minute ke andar dikhne lagenge, aur page par koi demo/fake data nahi rahega.

