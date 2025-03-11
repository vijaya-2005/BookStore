import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './App.css';

export default function App() {
  const [gBook, setGetBook] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Author: "",
    Price: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentBookName, setCurrentBookName] = useState("");

  const updateFormRef = useRef(null); // Reference for the update form

  // Fetch books from backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/Home/GetBook");
      setGetBook(response.data.data); // Ensure the response contains a `data` property
    } catch (err) {
      console.log("Error fetching books: ", err);
    }
  };

  // Add a new book
  const postData = async (e) => {
    e.preventDefault();
    if (formData.Name && formData.Author && formData.Price) {
      try {
        await axios.post("http://localhost:3001/Home/PostBook", formData);
        fetchData(); // Refresh the list after posting
        setFormData({ Name: "", Author: "", Price: "" }); // Reset form
      } catch (err) {
        console.log("Error adding book: ", err);
      }
    }
  };

  // Update an existing book
  const putData = async (e) => {
    e.preventDefault();
    if (formData.Name && formData.Author && formData.Price) {
      try {
        await axios.put(
          `http://localhost:3001/Home/UpdateBook/${currentBookName}`,
          formData
        );
        fetchData(); // Refresh the list after updating
        setFormData({ Name: "", Author: "", Price: "" });
        setIsUpdating(false);
        setCurrentBookName("");
      } catch (err) {
        console.log("Error updating book: ", err);
      }
    }
  };

  // Delete a book
  const deleteBook = async (name) => {
    try {
      await axios.delete(`http://localhost:3001/Home/DeleteBook/${name}`);
      fetchData(); // Refresh the list after deletion
    } catch (err) {
      console.log("Error deleting book: ", err);
    }
  };

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Set the form to update an existing book
  const handleUpdateClick = (book) => {
    setFormData({
      Name: book.Name,
      Author: book.Author,
      Price: book.Price,
    });
    setIsUpdating(true); // Enable update mode
    setCurrentBookName(book.Name); // Set the current book name for update

    // Ensure the updateFormRef is set and scroll only when it's available
    if (updateFormRef.current) {
      updateFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app-container">
      <h1>📚Book Store📚</h1>

      {/* Add New Book Form */}
      <h2>Add New Book</h2>
      <form onSubmit={postData}>
        <input
          type="text"
          name="Name"
          placeholder="Book Name"
          value={formData.Name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Author"
          placeholder="Author"
          value={formData.Author}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Price"
          placeholder="Price"
          value={formData.Price}
          onChange={handleChange}
        />
        <button type="submit">Add Book</button>
      </form>

      {/* Display List of Books */}
      <h2>Books List</h2>
      {Array.isArray(gBook) && gBook.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gBook.map((book, index) => (
              <tr key={index}>
                <td>{book.Name}</td>
                <td>{book.Author}</td>
                <td>{book.Price}</td>
                <td>
                  <button onClick={() => handleUpdateClick(book)} className="update">
                    Update
                  </button>
                  <button onClick={() => deleteBook(book.Name)} className="delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books found</p>
      )}

      {/* Update Book Form */}
      {isUpdating && (
        <div ref={updateFormRef}>
          <h2>Update Book</h2>
          <form onSubmit={putData}>
            <input
              type="text"
              name="Name"
              placeholder="Book Name"
              value={formData.Name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="Author"
              placeholder="Author"
              value={formData.Author}
              onChange={handleChange}
            />
            <input
              type="text"
              name="Price"
              placeholder="Price"
              value={formData.Price}
              onChange={handleChange}
            />
            <button type="submit">Update Book</button>
          </form>
        </div>
      )}
    </div>
  );
}
