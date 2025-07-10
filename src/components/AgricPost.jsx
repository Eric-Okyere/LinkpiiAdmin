import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import baseURL from "../assets/baseURL";

const AgricPost = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get `id` from the URL to determine edit mode

  // State for form fields
  const [picture, setPicture] = useState({ file: null, preview: null });
  const [pictureSec, setPictureSec] = useState({ file: null, preview: null });
  const [video, setVideo] = useState({ file: null, preview: null });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
//   const [discount, setDiscount] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("");
//   const [condition, setCondition] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch categories for the dropdown
    fetch(`${baseURL}fashion`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    // If `id` exists, fetch product data for editing
    if (id) {
      fetch(`${baseURL}fashionpost/${id}`)
        .then((res) => res.json())
        .then((item) => {
          setName(item.name || "");
          setPrice(item.price || "");
          setDiscount(item.discount || "");
          setPhone(item.phone || "");
          setDescription(item.description || "");
          setCategory(item.category || {});
          setCondition(item.condition || "");
          setLocation(item.location || "");
          setRegion(item.region || "");
          setTown(item.town || "");
          setWhatsapp(item.whatsapp || "");
          if (item.picture) setPicture({ file: null, preview: item.picture });
          if (item.picturesec) setPictureSec({ file: null, preview: item.picturesec });
          if (item.video) setVideo({ file: null, preview: item.video });
        })
        .catch((err) => console.error("Error fetching product details:", err));
    }
  }, [id]);

  // Handle file upload preview
  const handleFileChange = (e, setFileState) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFileState({ file, preview: previewURL });
    }
  };

  useEffect(() => {
    return () => {
      if (picture.preview) URL.revokeObjectURL(picture.preview);
      if (pictureSec.preview) URL.revokeObjectURL(pictureSec.preview);
      if (video.preview) URL.revokeObjectURL(video.preview);
    };
  }, [picture, pictureSec, video]);

  // Handle form submission
  const handleSubmit = async () => {
    // if (!name || !picture.file || !pictureSec.file || !price || !category) {
    //   setError("Please fill in all required fields.");
    //   return;
    // }
  
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("picture", picture.file);
    formData.append("pictureSec", pictureSec.file);
    if (video.file) formData.append("video", video.file);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("phone", phone);
    formData.append("description", description);
    formData.append("condition", condition);
    formData.append("location", location);
    formData.append("region", region);
    formData.append("town", town);
    formData.append("whatsapp", whatsapp);
    formData.append("category", category._id);
  
    try {
      console.log("Sending request...");
  
      const response = await fetch(`${baseURL}fashionpost/${id}`, {
        method: id ? "PUT" : "POST",
        body: formData,
      });
  
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error response:", errorMessage);
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Server response:", result);
  
      setIsLoading(false);
      navigate("/"); // Redirect to home or another page
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setError("An error occurred while submitting the form. Please try again.");
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-50 pt-28">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        {id ? "Edit Post" : "Create Post"}
      </h1>
      <div className="w-full max-w-lg space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <input
              type="file"
              accept="image/*"
              className="block w-full border rounded p-2"
              onChange={(e) => handleFileChange(e, setPicture)}
            />
            {picture.preview && <img src={picture.preview} alt="Preview" className="mt-2 w-full" />}
          </div>
          <div className="w-1/2">
            <input
              type="file"
              accept="image/*"
              className="block w-full border rounded p-2"
              onChange={(e) => handleFileChange(e, setPictureSec)}
            />
            {pictureSec.preview && (
              <img src={pictureSec.preview} alt="Preview" className="mt-2 w-full" />
            )}
          </div>
        </div>

        <div>
          <input
            type="file"
            accept="video/*"
            className="block w-full border rounded p-2"
            onChange={(e) => handleFileChange(e, setVideo)}
          />
          {video.preview && <video src={video.preview} controls className="mt-2 w-full h-[30vh]" />}
        </div>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="block w-full border rounded p-2"
        />
        {/* <input
          type="text"
          placeholder="Discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="block w-full border rounded p-2"
        /> */}
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="block w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="block w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Town"
          value={town}
          onChange={(e) => setTown(e.target.value)}
          className="block w-full border rounded p-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full border rounded p-2"
        />
        <select
          value={category._id || ""}
          onChange={(e) => setCategory(categories.find((cat) => cat._id === e.target.value))}
          className="block w-full border rounded p-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {/* <input
          type="text"
          placeholder="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="block w-full border rounded p-2"
        /> */}
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white rounded p-2 ${
            isLoading && "opacity-50"
          }`}
        >
          {isLoading ? "Submitting..." : id ? "Update Post" : "Create Post"}
        </button>
      </div>
    </div>
  );
};

export default AgricPost;
