import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Heart,
  Bookmark,
  Share2,
  Trash2,
  Edit,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { recipesAPI, reactionAPI, saveAPI, followAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { mockRecipes } from "@/data/mockRecipes";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReacted, setIsReacted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [showVideo, setShowVideo] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await recipesAPI.getById(id);
        const data = res.data?.data || res.data || {};
        const rawRecipe = data.recipe || data;

        const normalizedRecipe = {
          ...rawRecipe,
          id: rawRecipe.id || rawRecipe._id,
          image: rawRecipe.images?.[0] || "",
          date: new Date(
            rawRecipe.createdAt || Date.now(),
          ).toLocaleDateString(),
          cookTime: rawRecipe.cookingTime
            ? `${rawRecipe.cookingTime} min`
            : "15 min",
          author: rawRecipe.author?.name || "Unknown Chef",
          authorId: rawRecipe.author?._id || rawRecipe.authorId, // Ensure authorId is available
          videoUrl: rawRecipe.videoUrl || "",
        };

        setRecipe(normalizedRecipe);
        setIsReacted(normalizedRecipe.isReacted || false);
        setIsSaved(normalizedRecipe.isSaved || false);
        // Assuming the API returns isFollowing in the author object or root
        // If not, it defaults to false and relies on user interaction or profile fetch (optional improvement)
        setIsFollowing(
          rawRecipe.author?.isFollowing || rawRecipe.isFollowing || false,
        );
      } catch (error) {
        console.error("Failed to fetch recipe, using mock data:", error);
        const foundRecipe = mockRecipes.find((r) => r.id === id);
        setRecipe(foundRecipe || null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleReaction = async () => {
    try {
      if (isReacted) {
        await reactionAPI.unreact(id);
        setIsReacted(false);
      } else {
        await reactionAPI.react(id);
        setIsReacted(true);
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await saveAPI.unsaveRecipe(id);
        setIsSaved(false);
      } else {
        await saveAPI.saveRecipe(id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    }
  };

  const handleFollow = async () => {
    if (!recipe?.authorId) return;
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(recipe.authorId);
        setIsFollowing(false);
        toast.success(`Unfollowed ${recipe.author}`);
      } else {
        await followAPI.followUser(recipe.authorId);
        setIsFollowing(true);
        toast.success(`Following ${recipe.author}`);
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      toast.error("Failed to update follow status");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe?.title,
          text: recipe?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone.",
      )
    ) {
      try {
        await recipesAPI.delete(id);
        toast.success("Recipe deleted successfully");
        navigate("/profile");
      } catch (error) {
        console.error("Failed to delete recipe:", error);
        toast.error("Failed to delete recipe");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold">Recipe not found</h2>
          <Link
            to="/"
            className="text-primary mt-4 inline-block hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user is the author
  // Depending on how user ID is stored (sometimes _id, sometimes id). adjust comparison.
  const isAuthor =
    user &&
    recipe.authorId &&
    (user.id === recipe.authorId || user._id === recipe.authorId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to recipes
      </Link>

      {/* Image */}
      <div className="rounded-2xl overflow-hidden mb-8">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 md:h-96 object-cover"
        />
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {recipe.category}
          </span>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground leading-tight">
            {recipe.title}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-2">
              By {recipe.author}
              {!isAuthor && (
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors border ${
                    isFollowing
                      ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                      : "border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" /> Follow
                    </>
                  )}
                </button>
              )}
            </span>
            <span>•</span>
            <span>{recipe.date}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isAuthor && (
            <>
              <button
                onClick={() => navigate(`/edit-recipe/${id}`)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Edit Recipe"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors text-muted-foreground hover:text-red-500"
                title="Delete Recipe"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={handleReaction}
            className={`w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors ${isReacted ? "bg-red-50 text-red-500" : ""}`}
            title={isReacted ? "Unlike" : "Like"}
          >
            <Heart className={`w-4 h-4 ${isReacted ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleSave}
            className={`w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors ${isSaved ? "bg-blue-50 text-blue-500" : ""}`}
            title={isSaved ? "Unsave" : "Save"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-muted-foreground mb-10">{recipe.description}</p>

      {/* Video Tutorial Toggle */}
      {recipe.videoUrl && (
        <div className="mb-10">
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">
                  Watch Video Tutorial
                </h3>
                <p className="text-sm text-muted-foreground">
                  Step-by-step guide for this recipe
                </p>
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 ${showVideo ? "rotate-180" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showVideo
                ? "grid-rows-[1fr] opacity-100 mt-4"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-2xl overflow-hidden bg-black aspect-video relative shadow-lg">
                {getYouTubeEmbedUrl(recipe.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(recipe.videoUrl)}
                    title="Video Tutorial"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={recipe.videoUrl}
                    controls
                    className="absolute inset-0 w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-10">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <h2 className="font-display text-xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm cursor-pointer group select-none"
                onClick={() => toggleIngredient(i)}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 shrink-0 transition-colors ${
                    checkedIngredients[i]
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary/20"
                  }`}
                >
                  {checkedIngredients[i] ? "✓" : i + 1}
                </div>
                <span
                  className={`transition-opacity ${checkedIngredients[i] ? "line-through text-muted-foreground opacity-70" : ""}`}
                >
                  {ing}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="md:col-span-2">
          <h2 className="font-display text-xl font-bold mb-4">Instructions</h2>
          <ol className="space-y-6">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm pt-1.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Detail;
