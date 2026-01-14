import { X } from "lucide-react";
import { useState } from "react";
import { api } from "../utils/api";

const CreateGigModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [budgetError, setBudgetError] = useState("");

  const validateTitle = (value) => {
    if (!value) {
      setTitleError("Title is required");
      return false;
    }
    setTitleError("");
    return true;
  };

  const validateDescription = (value) => {
    if (!value) {
      setDescriptionError("Description is required");
      return false;
    }
    setDescriptionError("");
    return true;
  };

  const validateBudget = (value) => {
    if (!value) {
      setBudgetError("Budget is required");
      return false;
    }

    if (isNaN(value) || Number(value) <= 0) {
      setBudgetError("Enter a valid budget amount");
      return false;
    }

    setBudgetError("");
    return true;
  };

  const handleSubmit = async () => {
    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    const isBudgetValid = validateBudget(budget);

    if (!isTitleValid || !isDescriptionValid || !isBudgetValid) return;

    console.log({ title, description, budget });

    await api.post("/api/gigs", {
      title,
      description,
      budget,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create New Gig</h2>

        {/* Title */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Title</label>
          <input
            type="text"
            className="w-full bg-gray-100 px-3 py-2 rounded-lg outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => validateTitle(e.target.value)}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-1">{titleError}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            className="w-full bg-gray-100 px-3 py-2 rounded-lg outline-none resize-none"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => validateDescription(e.target.value)}
          />
          {descriptionError && (
            <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
          )}
        </div>

        {/* Budget */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Budget</label>

          <div className="flex items-center bg-gray-100 rounded-lg px-3">
            <span className="text-gray-500 font-medium">₹</span>
            <input
              type="text"
              className="w-full bg-transparent px-2 py-2 outline-none"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onBlur={(e) => validateBudget(e.target.value)}
            />
          </div>

          {budgetError && (
            <p className="text-red-500 text-sm mt-1">{budgetError}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Gig
        </button>
      </div>
    </div>
  );
};

export default CreateGigModal;
