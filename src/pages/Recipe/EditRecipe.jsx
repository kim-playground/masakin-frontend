import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { recipesAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  Minus,
  Upload,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  X,
  Clock,
  Type,
  AlignLeft,
  Tag,
  List,
  ChefHat,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomSelect from "@/components/ui/CustomSelect";
import { categories } from "@/data/constants";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    category: "",
    imageUrl: "",
    ingredients: [""],
    steps: [""],
    videoUrl: "",
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await recipesAPI.getById(id);
        const data = res.data?.data || res.data || {};
        const recipe = data.recipe || data;

        // Check ownership
        if (user && recipe.author?._id && user.id !== recipe.author._id) {
          // This check depends on how user ID is stored.
          // If user.id is correct.
          // For now let's just populate.
        }

        setFormData({
          title: recipe.title || "",
          description: recipe.description || "",
          cookingTime: recipe.cookingTime || "",
          category: recipe.category || "",
          imageUrl: recipe.images?.[0] || "",
          ingredients:
            recipe.ingredients && recipe.ingredients.length > 0
              ? recipe.ingredients
              : [""],
          steps: recipe.steps && recipe.steps.length > 0 ? recipe.steps : [""],
          videoUrl: recipe.videoUrl || "",
        });
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setError("Failed to load recipe data.");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.cookingTime
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Filter empty ingredients/steps
    const cleanIngredients = formData.ingredients.filter((i) => i.trim());
    const cleanSteps = formData.steps.filter((s) => s.trim());

    if (cleanIngredients.length === 0 || cleanSteps.length === 0) {
      setError("Please add at least one ingredient and one step");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        cookingTime: parseInt(formData.cookingTime),
        category: formData.category,
        ingredients: cleanIngredients,
        steps: cleanSteps,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        videoUrl: formData.videoUrl,
        portion: 2,
        difficulty: "medium",
      };

      await recipesAPI.update(id, payload);
      navigate(`/recipe/${id}`); // Redirect back to detail
    } catch (err) {
      console.error("Failed to update recipe:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update recipe",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to edit a recipe.</p>
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
      <Link
        to={`/recipe/${id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel
      </Link>

      <div className="bg-background rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">
          Edit Recipe
        </h1>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b border-border pb-2 flex items-center gap-2"></h2>

            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                Recipe Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. Creamy Mushroom Pasta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-muted-foreground" />
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Briefly describe your recipe..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                <Video className="w-4 h-4 text-muted-foreground" />
                Video Tutorial URL{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional)
                </span>
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. https://youtube.com/watch?v=..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  Category <span className="text-destructive">*</span>
                </label>
                <CustomSelect
                  options={categories}
                  value={formData.category}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, category: val }))
                  }
                  placeholder="Select a category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Cooking Time (minutes){" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. 45"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Recipe Image
              </label>

              {!formData.imageUrl ? (
                <div
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  <input
                    type="file"
                    id="imageInput"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-border group">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-48 md:h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-white/90 text-destructive p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <List className="w-5 h-5" /> Ingredients
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem("ingredients")}
                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={ing}
                    onChange={(e) =>
                      handleArrayChange(i, "ingredients", e.target.value)
                    }
                    className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder={`Ingredient ${i + 1}`}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(i, "ingredients")}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ChefHat className="w-5 h-5" /> Instructions
              </h2>
              <button
                type="button"
                onClick={() => addArrayItem("steps")}
                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Step
              </button>
            </div>

            <div className="space-y-3">
              {formData.steps.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-8 h-10 flex items-center justify-center font-bold text-muted-foreground shrink-0">
                    {i + 1}
                  </div>
                  <textarea
                    value={step}
                    onChange={(e) =>
                      handleArrayChange(i, "steps", e.target.value)
                    }
                    rows={2}
                    className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder={`Step ${i + 1} description...`}
                  />
                  {formData.steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(i, "steps")}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start mt-2"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-8 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
