import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUser } from "../context/UserContext.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBook = () => {
  const { isAuthenticated, loading, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const initialValues = {
    title: "",
    author: "",
    genre: "",
    description: "",
    page_count: "",
    image_url: "",
    publication_year: "",
  };

  const validationSchema = Yup.object({
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
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
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
        toast.success("Book added successfully!");
        setTimeout(() => navigate("/home"), 2000); // Redirect after 2 seconds
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add the book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="max-w-4xl mx-auto p-8 shadow rounded"
        style={{ backgroundColor: "#2c2c2c", color: "#e0e0e0" }}
      >
        <h1
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Add a New Book
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Field
                  type="text"
                  name="title"
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Author</label>
                <Field
                  type="text"
                  name="author"
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <ErrorMessage
                  name="author"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Genre</label>
                <Field
                  type="text"
                  name="genre"
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <ErrorMessage
                  name="genre"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Field
                  type="text"
                  name="description"
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Page_count</label>
                <Field
                  type="number"
                  name="page_count"
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <ErrorMessage
                  name="page_count"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Image Url</label>
                <Field
                  type="text"
                  name="image_url"
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <ErrorMessage
                  name="image_url"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Publication_year
                </label>
                <Field
                  type="number"
                  name="publication_year"
                  className="w-full p-2 border rounded"
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#8f7e4f",
                    color: "#e0e0e0",
                  }}
                />
                <ErrorMessage
                  name="publication_year"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-opacity-90"
                style={{ backgroundColor: "#8f7e4f", color: "#e0e0e0" }}
              >
                {isSubmitting ? "Submitting..." : "Add Book"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-full bg-gray-500 text-white py-2 rounded hover:bg-opacity-90 mt-4"
              >
                Back to Home
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddBook;
