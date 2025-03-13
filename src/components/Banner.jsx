import React from "react";
import banner from "../assets/banner.jpg";

const Banner = () => {
  return (
    <div className="py-8 md:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-hair-color leading-tight mb-4 md:mb-6">
              Welcome to Quizora
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 max-w-2xl">
              Challenge yourself with our exciting quiz games! Test your knowledge
              across various topics and compete with others.
            </p>
            <button className="inline-flex items-center justify-center px-6 py-3 text-base md:text-lg font-semibold text-hair-color bg-white hover:bg-hair-color hover:text-white transition-colors duration-300 rounded-full shadow-md hover:shadow-lg">
              Play Quiz
            </button>
          </div>
          <div className="flex-1 w-full md:w-auto">
            <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl shadow-xl">
              <img
                src={banner}
                alt="Quiz platform banner"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
