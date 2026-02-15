import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import RecipeCard from "@/components/recipe/RecipeCard";
import { recipesAPI } from "@/services/api";
import { mockRecipes } from "@/data/mockRecipes";
import heroFood from "@/assets/hero-food.jpg";
import featuredImg from "@/assets/recipe-featured.jpg";
import mobileMockup from "@/assets/mobile-mockup.png";
import { toast } from "sonner";

import { categories } from "@/data/constants";
const allCategories = ["All", ...categories];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params = {
          ...(searchQuery && { search: searchQuery }),
          ...(selectedCategory !== "All" && { category: selectedCategory }),
        };
        const res = await recipesAPI.getAll(params);
        // Handle different response structures
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
        setRecipes(mockRecipes);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery, selectedCategory]);

  const filtered = (Array.isArray(recipes) ? recipes : []).filter((r) => {
    const matchSearch =
      !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "All" || r.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const latestRecipes = filtered.slice(0, 3);
  const moreRecipes = filtered.slice(3, 7);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-16">
        {/* Decorative Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 text-4xl animate-float opacity-20">
            🥗
          </div>
          <div className="absolute top-1/3 right-10 text-6xl animate-float animation-delay-2000 opacity-20">
            🍕
          </div>
          <div className="absolute bottom-1/4 left-20 text-5xl animate-float animation-delay-4000 opacity-20">
            🥘
          </div>
          <div className="absolute top-1/2 right-1/4 text-4xl animate-float animation-delay-1000 opacity-20">
            🥑
          </div>
          <div className="absolute bottom-10 right-20 text-5xl animate-float animation-delay-3000 opacity-20">
            🥞
          </div>

          {/* Blobs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            #1 Cooking Community
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] tracking-tighter animate-fade-in-up">
            Delicious Recipes For <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Home-Cooked
            </span>{" "}
            Meals.
          </h1>

          <p className="text-muted-foreground mt-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed animate-fade-in-up">
            Elevate your home cooked meals with our delicious recipes
            collection. From classic comfort foods to international cuisines, we
            have something for every taste.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link
              to="/discover"
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-primary/20"
            >
              Start Cooking Now
            </Link>
          </div>
        </div>
      </section>
      {/* Latest Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Recipes, Guides and More
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-1">
              Explore Our Latest Recipes
            </h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-40">
              <CustomSelect
                options={allCategories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
                className="w-full"
              />
            </div>
            <Link
              to="/discover"
              className="hidden md:inline-flex text-sm border border-border rounded-full px-4 py-2 hover:bg-secondary transition-colors whitespace-nowrap"
            >
              View all
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* Recipe grid - top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {latestRecipes.map((recipe, i) => (
                <RecipeCard
                  key={recipe.id}
                  {...recipe}
                  variant={i === 0 ? "large" : "medium"}
                />
              ))}
            </div>

            {/* More recipes - 4 cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {moreRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  {...recipe}
                  description={recipe.description}
                />
              ))}
            </div>
          </>
        )}
      </section>
      {/* Recipe of the Day */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] group">
          <img
            src={featuredImg}
            alt="Recipe of the day"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 flex flex-col items-center text-center">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-lg border border-primary/20">
              Recipe of the day
            </span>
            <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-xl max-w-3xl leading-tight">
              Cheesy Pizza with Tomato Sauce Grilled
            </h3>
            <div className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-2xl shadow-xl">
              <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed font-medium">
                Eat like a local with a homemade pizza loaded with your own
                toppings. Be creative by adding fresh seasonal ingredients for
                the ultimate pizza experience.
              </p>
              <p className="text-white/70 text-sm italic">— Thomas Arlo</p>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Download App
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 leading-tight text-foreground">
              Unleash Culinary Creativity with Masakin
            </h2>
            <p className="text-muted-foreground mt-6 text-lg">
              Find all the recipes from around the world in one app. Easy to
              use, cook up ideas from breakfast to harvest. Recipes can be saved
              and viewed anytime/anywhere, download now for free!
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => toast.info("App Store version coming soon!")}
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              >
                <div className="text-2xl"></div>
                <div className="text-left leading-tight">
                  <div className="text-[10px] font-medium opacity-80 uppercase">
                    Download on the
                  </div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              <button
                onClick={() => toast.info("Android version coming soon!")}
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
              >
                <div className="text-2xl">▶️</div>
                <div className="text-left leading-tight">
                  <div className="text-[10px] font-medium opacity-80 uppercase">
                    Get it on
                  </div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <img
                src={mobileMockup}
                alt="Masakin Mobile App"
                className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
