import Container from "../common/Container/Container";

const Brands = () => {
  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <p className="text-center text-gray-500 mb-8 text-sm font-medium">
          TRUSTED BY CREATORS AND BRANDS WORLDWIDE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="w-24 h-12 bg-gray-200 rounded opacity-50"></div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Brands;