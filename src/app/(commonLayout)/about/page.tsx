
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "About Us - BeautyMart",
  description: "Learn more about BeautyMart and our commitment to premium beauty products.",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 text-gray-800">
      {/* Intro */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 text-pink-700">Welcome to BeautyMart</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Discover the ultimate destination for beauty enthusiasts. From skincare and haircare to makeup and fragrances, we bring premium products and expert advice directly to you. 
          BeautyMart is your trusted partner for a confident, radiant, and empowered look every day.
        </p>
      </section>

      {/* Mission Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100 hover:shadow-2xl transition">
          <h3 className="text-2xl font-semibold text-pink-600">Luxury, Fast & Reliable</h3>
          <p className="mt-4 text-gray-700">
            Enjoy premium beauty products delivered quickly and securely. All orders are carefully handled to ensure your satisfaction.
          </p>
          <p className="mt-4 text-gray-700">
            Our dedicated customer support is always ready to guide you in choosing the perfect products.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100 hover:shadow-2xl transition">
          <h3 className="text-2xl font-semibold text-pink-600">Quality You Can Trust</h3>
          <p className="mt-4 text-gray-700">
            Each product at BeautyMart comes from verified premium brands, ensuring only the finest quality reaches you.
          </p>
          <p className="mt-4 text-gray-700">
            Your beauty and confidence are our top priority—every product, every order.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-pink-700">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Premium Quality", description: "Only top-notch beauty products handpicked for you." },
            { title: "Customer Satisfaction", description: "Your happiness and confidence matter most." },
            { title: "Trend & Innovation", description: "Always up-to-date with the latest beauty trends." },
          ].map(({ title, description }, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl shadow-md text-center border border-pink-100 hover:shadow-xl transition">
              <div className="mb-4 mx-auto w-fit text-pink-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold mb-10 text-pink-600">Why Choose BeautyMart?</h2>
        <div className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto">
          {[
            "Premium Beauty Products Curated For You",
            "Cruelty-Free & Natural Ingredients",
            "Fast, Secure & Reliable Delivery",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl shadow-md bg-white w-full md:w-[300px] hover:shadow-xl transition">
              <CheckCircle className="text-pink-500 w-6 h-6" />
              <p className="text-lg text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-pink-600">Need Assistance?</h2>
        <p className="text-lg text-gray-700 mb-6">Our beauty experts are ready to help you anytime.</p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "Email", value: "support@BeautyMart.com" },
            { label: "Phone", value: "+123-456-7890" },
            { label: "Live Chat", value: "Available 24/7" },
          ].map((contact, i) => (
            <div key={i} className="p-5 bg-pink-600 text-white rounded-2xl shadow-md hover:bg-pink-700 transition">
              <p className="text-sm uppercase text-pink-200">{contact.label}</p>
              <p className="text-lg font-medium">{contact.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
