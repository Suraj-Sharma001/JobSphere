import React from 'react';
import { MapPin, Users, Award, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-16 text-center shadow-2xl border border-white/20 mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Graphic Era Hill University
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            At the forefront of Quality Higher Education and Academic Excellence
          </p>
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            Founded in 2011 • Transforming Dreams into Reality
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 mb-12">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            About Our University
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              Graphic Era Hill University is a private university located in Dehradun, Uttarakhand, India, 
              with the goal of providing world-class education with a clear focus on cutting-edge technologies, 
              professional development of students, critical thinking and quality research. The University has 
              achieved numerous milestones in its glorious past on the basis of its academic rigor, consistently 
              Top Performing Students and Alumni and an immensely strong and qualified teaching fraternity.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-l-4 border-blue-500 my-8">
              <div className="flex items-center mb-4">
                <MapPin className="text-blue-600 w-6 h-6 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Prime Location</h3>
              </div>
              <p className="text-gray-700">
                Graphic Era Hill University is based in the magnificent and serene city of Dehradun, 
                nestled in the valley surrounded by Rajaji National Park on one end and Clement Town 
                Cantonment on the other. The University prides itself in its University regime that 
                warrants the holistic development of all the students part of the Graphic Era Fraternity.
              </p>
            </div>

            <p>
              At GEHU it is our commitment to provide high-quality education and research opportunities 
              that contribute to knowledge creation and innovation, not just in our region, but on an 
              international scale. Our faculty members are experts in their respective fields and are 
              dedicated to inspiring and mentoring the next generation of leaders.
            </p>
          </div>
        </div>

        {/* Campus Locations */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 mb-12">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Three Campuses
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Three self-contained campuses offering comprehensive and enriching academic experiences
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Dehradun Campus */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Dehradun Campus</h3>
              <p className="text-gray-600 leading-relaxed">
                Amidst the Shivalik Hills and Rajaji National Park, providing an ideal setting for 
                academic excellence with modern facilities including computer centers, classrooms, 
                accommodation, medical services, and a radio station. Recognized at national and 
                international events.
              </p>
            </div>

            {/* Bhimtal Campus */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Bhimtal Campus</h3>
              <p className="text-gray-600 leading-relaxed">
                Nestled in the Kumaon foothills, offering a serene environment with academic, research, 
                and administrative facilities. Features include student accommodation, Open Air Theatre, 
                cafeteria, play fields, library, and well-designed lecture theatres. Well-connected to 
                major cities by road and rail.
              </p>
            </div>

            {/* Haldwani Campus */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Haldwani Campus</h3>
              <p className="text-gray-600 leading-relaxed">
                Located in the bustling commercial market, combining natural beauty with urban excitement. 
                Features an impressive amphitheater, lively cafeterias, sports fields, grand library, 
                well-equipped labs, computer centers, and dynamic lecture theatres offering diverse courses.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/20">
            <div className="flex items-center mb-6">
              <Users className="text-blue-600 w-8 h-8 mr-4" />
              <h3 className="text-2xl font-bold text-gray-800">Diverse Community</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our campuses are home to a diverse student population who come from all over the world, 
              contributing to a vibrant and inclusive learning community with co-curricular activities, 
              cultural events, and social initiatives.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/20">
            <div className="flex items-center mb-6">
              <BookOpen className="text-purple-600 w-8 h-8 mr-4" />
              <h3 className="text-2xl font-bold text-gray-800">Academic Excellence</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              World-class education and research experience that fosters innovation, diversity, and community. 
              We are an important and much sought-after centre of learning and research, shaping the future 
              of our students and our world.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Dreams?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who have chosen excellence at Graphic Era Hill University
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                Apply Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:-translate-y-1">
                Visit Campus
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 hover:-translate-y-1">
                Talk to Counsellors
              </button>
            </div>
          </div>
        </div>

        {/* Admission Notice */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Award className="text-green-600 w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold text-green-800">Admissions Open 2025</h3>
          </div>
          <p className="text-green-700 text-lg">
            The application process at Graphic Era is strictly based on the Merit of the qualifying 
            examination with the entire Admission Process available for completion online
          </p>
        </div>
      </div>
    </div>
  );
}