import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { saveAPI } from "@/services/api";

const RecipeCard = ({
  id,
  title,
  image,
  category,
  date,
  cookTime,
  description,
  variant = "small",
  isSaved = false,
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      if (saved) {
        await saveAPI.unsaveRecipe(id);
        setSaved(false);
        toast.success("Recipe removed from saved");
      } else {
        await saveAPI.saveRecipe(id);
        setSaved(true);
        toast.success("Recipe saved successfully");
      }
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast.error("Failed to save recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "large") {
    return (
      <Link
        to={`/recipe/${id}`}
        className="group block relative rounded-xl overflow-hidden row-span-2"
      >
        <div className="aspect-[3/4] w-full">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <button
          onClick={handleSave}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            saved
              ? "bg-primary text-primary-foreground"
              : "bg-white/30 text-white hover:bg-white hover:text-primary"
          }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-24">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded mb-2 shadow-sm">
            {category}
          </span>
          <h3 className="text-xl font-bold font-display text-white leading-tight drop-shadow-md">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-3 text-xs text-white/90 font-medium">
            <span>{date}</span>
            <span>•</span>
            <Clock className="w-3 h-3" />
            <span>{cookTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/recipe/${id}`} className="group block">
      <div className="rounded-xl overflow-hidden mb-3 relative">
        <img
          src={image}
          alt={title}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          className={`absolute top-2 right-2 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 ${
            saved
              ? "bg-primary text-primary-foreground opacity-100"
              : "bg-white/80 hover:bg-white text-primary"
          }`}
          onClick={handleSave}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>
      <span className="text-xs text-muted-foreground font-medium">
        {category}
      </span>
      <h3 className="font-display font-semibold text-sm mt-1 leading-tight group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
        <span>{date}</span>
        <span>•</span>
        <Clock className="w-3 h-3" />
        <span>{cookTime}</span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
          {description}
        </p>
      )}
    </Link>
  );
};

export default RecipeCard;
