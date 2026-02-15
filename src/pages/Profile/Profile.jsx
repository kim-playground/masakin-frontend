import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { profileAPI } from "@/services/api";
import RecipeCard from "@/components/recipe/RecipeCard";
import { Settings, LogOut, Grid, Bookmark, Heart } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("recipes");

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!user?.id && !user?._id) return;

      try {
        setLoading(true);
        const res = await profileAPI.getUserRecipes(user.id || user._id);

        const rawRecipes =
          res.data?.data?.recipes || res.data?.recipes || res.data || [];

        const normalizedRecipes = (
          Array.isArray(rawRecipes) ? rawRecipes : []
        ).map((r) => ({
          ...r,
          id: r.id || r._id,
          image: r.images?.[0] || "",
          date: new Date(r.createdAt || Date.now()).toLocaleDateString(),
          cookTime: r.cookingTime ? `${r.cookingTime} min` : "15 min",
          author: r.author?.name || user.name || "Me",
        }));

        setRecipes(normalizedRecipes);
      } catch (err) {
        console.error("Failed to fetch user recipes:", err);
        setError("Could not load your recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
          <Link
            to="/login"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-primary/80 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Abstract Floating Card */}
        <div className="-mt-32 mb-12 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-40 h-40 rounded-full border-4 border-background bg-secondary text-primary flex items-center justify-center text-6xl font-display font-bold shadow-xl overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                (user.name?.charAt(0) || "U").toUpperCase()
              )}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-background rounded-full shadow-md border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <h1 className="font-display text-4xl font-bold text-foreground text-center">
            {user.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-center max-w-md">
            {user.bio || "Food enthusiast & home cook"}
          </p>

          <div className="flex items-center gap-8 mt-6 bg-background/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-border/50 shadow-sm">
            <div className="text-center">
              <span className="block font-bold text-2xl">{recipes.length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Recipes
              </span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <span className="block font-bold text-2xl">128</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Followers
              </span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <span className="block font-bold text-2xl">45</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Following
              </span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center border-b border-border mb-8">
            <button
              onClick={() => setActiveTab("recipes")}
              className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === "recipes"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="w-4 h-4" />
              My Recipes
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === "saved"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </button>
            <button
              onClick={() => setActiveTab("liked")}
              className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === "liked"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="w-4 h-4" />
              Liked
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "recipes" && (
              <>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {error}
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-secondary/20">
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Grid className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No recipes yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Share your culinary creations with the community!
                    </p>
                    <Link
                      to="/create-recipe"
                      className="text-primary font-semibold hover:underline"
                    >
                      Create your first recipe
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <RecipeCard key={recipe.id} {...recipe} />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "saved" && (
              <div className="text-center py-20 text-muted-foreground">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Saved recipes will appear here</p>
              </div>
            )}

            {activeTab === "liked" && (
              <div className="text-center py-20 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Recipes you've liked will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
