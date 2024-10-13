"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'new',
    location: '',
    imageUrl: '',
    contactInfo: {
      email: '',
      phone: '',
    },
  });

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'phone') {
      setFormData(prevState => ({
        ...prevState,
        contactInfo: {
          ...prevState.contactInfo,
          [name]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/books');
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        const data = await response.json();
        console.error('Failed to add book:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#E7D4B5] p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#A0937D]">Add a New Book</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="title" className="sr-only">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#B6C7AA] placeholder-[#A0937D] text-gray-900 rounded-t-md focus:outline-none focus:ring-[#B6C7AA] focus:border-[#B6C7AA] focus:z-10 sm:text-sm"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="author" className="sr-only">Author</label>
              <input
                id="author"
                name="author"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#B6C7AA] placeholder-[#A0937D] text-gray-900 focus:outline-none focus:ring-[#B6C7AA] focus:border-[#B6C7AA] focus:z-10 sm:text-sm"
                placeholder="Author"
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="condition" className="sr-only">Condition</label>
              <select
                id="condition"
                name="condition"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#B6C7AA] placeholder-[#A0937D] text-gray-900 focus:outline-none focus:ring-[#B6C7AA] focus:border-[#B6C7AA] focus:z-10 sm:text-sm"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="sr-only">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#B6C7AA] placeholder-[#A0937D] text-gray-900 focus:outline-none focus:ring-[#B6C7AA] focus:border-[#B6C7AA] focus:z-10 sm:text-sm"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="sr-only">Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#B6C7AA] placeholder-[#A0937D] text-gray-900 focus:outline-none focus:ring-[#B6C7AA] focus:border-[#B6C7AA] focus:z-10 sm:text-sm"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Contact Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#B6C7AA] placeholder-[#A0937D] text-gray-900 focus:outline-none focus:ring-[#B6C7AA] focus:border-[#B6C7AA] focus:z-10 sm:text-sm"
                placeholder="Contact Email"
                value={formData.contactInfo.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Contact Phone (optional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#B6C7AA] placeholder-[#A0937D] text-gray-900 rounded-b-md focus:outline-none focus:ring-[#B6C7AA] focus:border-[#B6C7AA] focus:z-10 sm:text-sm"
                placeholder="Contact Phone (optional)"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#A0937D] hover:bg-[#B6C7AA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B6C7AA]"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;