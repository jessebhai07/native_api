import dbConnect from "../../lib/dbConnect";
import Blog from "../../models/Blog";

export async function getStaticProps() {
  await dbConnect();

  let blogs = [];

  try {
    blogs = await Blog.find().lean();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: {
        blogs: [],
        error: "Failed to fetch blogs",
      },
    };
  }

  // Fix: Convert MongoDB ObjectId `_id` to string
  const serializedBlogs = blogs.map(blog => ({
    ...blog,
    _id: blog._id.toString(), // Convert `_id` to string
  }));

  return {
    props: { blogs: serializedBlogs },
  };
}

export default function Blogs({ blogs, error }) {
  if (error) return <p>{error}</p>;

  if (!blogs || blogs.length === 0) {
    return <p>No blogs available</p>;
  }

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.blog_title}</h2>
          <p>{blog.blog_description}</p>
        </div>
      ))}
    </div>
  );
}
