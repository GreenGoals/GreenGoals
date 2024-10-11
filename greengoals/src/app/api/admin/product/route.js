import { NextResponse } from "next/server"; // Add this import
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/product";

// Add new product (POST)
export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const product = new Product({
    name: body.name,
    description: body.description,
    price: body.price,
    stock: body.stock,
    category: body.category,
    images: body.images,
  });

  await product.save();
  return NextResponse.json({ message: "Product added successfully!" });
}

// Get all products (GET)
export async function GET() {
  await connectDB();
  const products = await Product.find({});
  return NextResponse.json(products);
}

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query; // استخراج ID من query

  if (req.method === "PUT") {
    const body = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
        category: body.category,
        images: body.images,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    return res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct, // Ensure the updated product is returned
    });
  } else {
    return res.status(405).json({ message: "Method not allowed!" });
  }
}

// Delete product by ID (DELETE)
export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();

  // Find and delete the product by ID
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return NextResponse.json(
      { message: "Product not found!" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Product deleted successfully!" });
}
