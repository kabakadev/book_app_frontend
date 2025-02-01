import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "../context/UserContext.js";

const AddBook = () => {
  const { isAuthenticated, loading, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      genre: "",
      description: "",
      page_count: "",
      image_url: "",
      publication_year: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      author: Yup.string().required("Author is required"),
      genre: Yup.string(),
      description: Yup.string(),
      page_count: Yup.number()
        .positive("Page count must be a positive number")
        .integer("Page count must be an integer"),
      image_url: Yup.string().url("Must be a valid URL"),
      publication_year: Yup.number()
        .min(1000, "Year must be valid")
        .max(new Date().getFullYear(), "Year cannot be in the future"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        });

        if (response.ok) {
          resetForm();
          alert("Book added successfully!");
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to add the book");
        }
      } catch (error) {
        console.error("Error adding book:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Add a New Book</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border ${
              formik.touched.title && formik.errors.title
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={formik.values.author}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border ${
              formik.touched.author && formik.errors.author
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
          />
          {formik.touched.author && formik.errors.author && (
            <p className="text-red-500 text-sm">{formik.errors.author}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Genre</label>
          <input
            type="text"
            name="genre"
            value={formik.values.genre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border ${
              formik.touched.genre && formik.errors.genre
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
          />
          {formik.touched.genre && formik.errors.genre && (
            <p className="text-red-500 text-sm">{formik.errors.genre}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">description</label>
          <input
            type="text"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Page COunt</label>
          <input
            type="number"
            name="page_count"
            value={formik.values.page_count}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border ${
              formik.touched.page_count && formik.errors.page_count
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
          />
          {formik.touched.page_count && formik.errors.page_count && (
            <p className="text-red-500 text-sm">{formik.errors.page_count}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Image Url</label>
          <input
            type="text"
            name="image_url"
            value={formik.values.image_url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border ${
              formik.touched.image_url && formik.errors.image_url
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
          />
          {formik.touched.image_url && formik.errors.image_url && (
            <p className="text-red-500 text-sm">{formik.errors.image_url}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Publication Year</label>
          <input
            type="number"
            name="publication_year"
            value={formik.values.publication_year}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border ${
              formik.touched.publication_year && formik.errors.publication_year
                ? "border-red-500"
                : "border-gray-300"
            } rounded`}
          />
          {formik.touched.publication_year &&
            formik.errors.publication_year && (
              <p className="text-red-500 text-sm">
                {formik.errors.publication_year}
              </p>
            )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {formik.isSubmitting ? "Submitting..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
