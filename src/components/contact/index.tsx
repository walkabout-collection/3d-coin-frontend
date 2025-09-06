"use client";

import Button from "../common/button/Button";
import Input from "../common/input";
import { contactHeroData } from "./data";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const iconMap = {
    mail: <Mail className="w-6 h-6 text-black" />,
    phone: <Phone className="w-6 h-6 text-black" />,
    "map-pin": <MapPin className="w-6 h-6 text-black" />,
  };

  return (
    <main className="mt-20">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center justify-center bg-[url('/images/contact-hero.png')] bg-cover bg-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-end w-8/12  text-white">
          Contact Us
        </h1>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {contactHeroData.title}
          </h2>
          <p className="text-gray-600 mb-8">{contactHeroData.description}</p>

          <div className="space-y-4">
            {contactHeroData.contacts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-4 bg-gradient-to-r from-[#0F1D37] to-[#143D6B] text-white px-6 py-4 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-center bg-white p-2 rounded-md">
                  {iconMap[item.icon as keyof typeof iconMap]}
                </div>
                <div className="whitespace-pre-line">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <Input
                type="text"
                placeholder="Enter your contact number"
                className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Please type your message here..."
                className="w-full border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-1/2 py-2 text-xl font-semibold"
            >
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
