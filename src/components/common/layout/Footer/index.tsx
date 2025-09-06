"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems, companyItems, instaImages, socialLinks } from "./data";
import Button from "../../button/Button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white px-6 md:px-20 py-12 ">
      {/* CTA */}
      <div className="text-center mb-12 w-full flex flex-col items-center">
        <Button variant="secondary" className="py-6 text-6xl font-bold" width="w-1/2" onClick={()=> console.log("Start Design Clicked")} >
            Start Designing Your Coin Today
        </Button>
      </div>

      {/* Main Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start max-w-10/12 mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/images/footer/LegacyForge.png"
            alt="Legacy Forge Icon"
            width={180}
            height={180}
          />
        </div>

        {/* Menu */}
        <div>
          <h3 className="font-semibold mb-4">Menu</h3>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="hover:text-ternary transition">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            {companyItems.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="hover:text-ternary transition">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Instagram */}
        <div>
          <h3 className="font-semibold mb-4">Follow on Instagram</h3>
          <div className="grid grid-cols-2 gap-2">
            {instaImages.map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                width={100}
                height={100}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Social Links + Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm max-w-10/12 mx-auto">
        <p>Copyright © 2023 BRIX Templates | All Rights Reserved</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          {socialLinks.map((link) => (
            <a key={link.alt} href={link.href} target="_blank" rel="noreferrer">
              <Image src={link.icon} alt={link.alt} width={24} height={24} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
