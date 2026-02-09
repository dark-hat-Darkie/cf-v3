import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Services from "./components/services";
import About from "./components/about";
import Stats from "./components/stats";
import Projects from "./components/projects";
import Testimonials from "./components/testimonials";
import Pricing from "./components/pricing";
import Contact from "./components/contact";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Stats />
      <Projects />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </>
  );
}
