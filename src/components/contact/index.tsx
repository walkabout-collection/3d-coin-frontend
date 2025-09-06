"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../common/button/Button";
import { contactHeroData } from "./data";
import { Mail, Phone, MapPin } from "lucide-react";
import Input from "../common/input";

// ✅ Schema validation
const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  contact: z.string().min(7, "Enter a valid phone number"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("✅ Form submitted:", data);
    reset();
  };

  const iconMap = {
    mail: <Mail className="w-6 h-6 text-black" />,
    phone: <Phone className="w-6 h-6 text-black" />,
    "map-pin": <MapPin className="w-6 h-6 text-black" />,
  };

  // Generate correct link for left side
  const getLink = (icon: string, value: string) => {
    switch (icon) {
      case "mail":
        return `mailto:${value}`;
      case "phone":
        return `tel:${value.replace(/\D/g, "")}`;
      case "map-pin":
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          value
        )}`;
      default:
        return "#";
    }
  };

  return (
    <main className="mt-20">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center justify-center bg-[url('/images/contact-hero.png')] bg-cover bg-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-end w-8/12  text-white">
          Contact Us
        </h1>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {contactHeroData.title}
          </h2>
          <p className="text-gray-600 mb-8">{contactHeroData.description}</p>

          <div className="space-y-4">
            {contactHeroData.contacts.map((item, idx) => (
              <a
                key={idx}
                href={getLink(item.icon, item.value)}
                target={item.icon === "map-pin" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="flex items-center space-x-4 bg-gradient-to-r from-[#0F1D37] to-[#143D6B] text-white px-6 py-4 shadow-md hover:opacity-90 transition"
              >
                <div className="flex items-center justify-center bg-white p-2">
                  {iconMap[item.icon as keyof typeof iconMap]}
                </div>
                <div className="whitespace-pre-line">{item.value}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                {...register("fullName")}
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300   "
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-gray-300 px-4 py-3   "
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <Input
                {...register("contact")}
                type="text"
                placeholder="Enter your contact number"
                className="w-full border border-gray-300 px-4 py-3   "
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Input
                {...register("message")}
                rows={4}
                placeholder="Please type your message here..."
                className="w-full border border-gray-300 px-4 py-3   "
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
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
