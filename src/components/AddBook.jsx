import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useUser } from "../context/UserContext.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBook = () => {
  const { isAuthenticated, loading, logout } = useUser();
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://book-app-backend-mp22.onrender.com";

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
      const response = await fetch(`${API_URL}/books`, {
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-16 h-16 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-background min-h-screen p-5">
      <div className="max-w-4xl mx-auto p-8 shadow rounded bg-card text-text-primary">
        <h1 className="text-3xl font-bold mb-6 text-primary font-serif">
          Add a New Book
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <FormField label="Title" name="title" type="text" />
              <FormField label="Author" name="author" type="text" />
              <FormField label="Genre" name="genre" type="text" />
              <FormField
                label="Description"
                name="description"
                type="textarea"
              />
              <FormField label="Page Count" name="page_count" type="number" />
              <FormField label="Image URL" name="image_url" type="text" />
              <FormField
                label="Publication Year"
                name="publication_year"
                type="number"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-background py-2 rounded hover:bg-opacity-90 transition-colors duration-200"
              >
                {isSubmitting ? "Submitting..." : "Add Book"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-full bg-card text-text-primary border border-secondary py-2 rounded hover:bg-opacity-90 transition-colors duration-200 mt-4"
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

const FormField = ({ label, name, type }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium mb-1">
      {label}
    </label>
    {type === "textarea" ? (
      <Field
        as="textarea"
        id={name}
        name={name}
        rows="4"
        className="w-full p-2 border rounded bg-background border-secondary text-text-primary focus:ring-1 focus:ring-primary"
      />
    ) : (
      <Field
        type={type}
        id={name}
        name={name}
        className="w-full p-2 border rounded bg-background border-secondary text-text-primary focus:ring-1 focus:ring-primary"
      />
    )}
    <ErrorMessage
      name={name}
      component="div"
      className="text-accent text-sm mt-1"
    />
  </div>
);

export default AddBook;
