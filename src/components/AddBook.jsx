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
        </div>{" "}
        //genre
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
        </div>{" "}
        //description
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
        </div>{" "}
        //page_count
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
        </div>{" "}
        //image_url
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
        </div>{" "}
        //publication_year
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
