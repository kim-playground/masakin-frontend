import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Loader2, Filter } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import RecipeCard from "@/components/recipe/RecipeCard";
import { recipesAPI } from "@/services/api";
import { mockRecipes } from "@/data/mockRecipes";
import { categories } from "@/data/constants";

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update URL params when state changes
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== "All") params.category = selectedCategory;
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params = {
          ...(searchQuery && { search: searchQuery }),
          ...(selectedCategory !== "All" && { category: selectedCategory }),
        };
        const res = await recipesAPI.getAll(params);

        const rawRecipes =
          res.data?.data?.recipes ||
          res.data?.recipes ||
          res.data?.data ||
          res.data ||
          [];

        const normalizedRecipes = (
          Array.isArray(rawRecipes) ? rawRecipes : []
        ).map((r) => ({
          ...r,
          id: r.id || r._id,
          image: r.images?.[0] || "",
          date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
          cookTime: r.cookingTime ? `${r.cookingTime} min` : "15 min",
          author: r.author?.name || "Unknown Chef",
        }));

        setRecipes(normalizedRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes, using mock data:", error);
        // Filter mock data locally if API fails
        let filtered = [...mockRecipes];
        if (searchQuery) {
          filtered = filtered.filter((r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }
        if (selectedCategory !== "All") {
          filtered = filtered.filter((r) => r.category === selectedCategory);
        }
        setRecipes(filtered);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      fetchRecipes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            Discover Recipes
          </h1>
          <p className="text-muted-foreground">
            Find your next favorite meal from our community.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              className="w-full pl-12 pr-6 py-3 rounded-full border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="w-full md:w-48 shrink-0">
            <CustomSelect
              options={["All", ...categories]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Category"
              icon={Filter}
              className="w-full"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No recipes found</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-2 text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
