import Navbar from "./components/Navbar";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar remains sticky or responsive */}
      <Navbar />

      {/* FirstSection full-width, responsive */}
      <div className="mt-8">{/*  */}</div>
    </div>
  );
};

export default Home;
