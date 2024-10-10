"use client";

export default function Ui({ id }) {
  return (
    <div className="flex flex-col md:flex-row items-center max-w-full">
      <img
        src="https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
        alt=""
        className="w-1/3"
      />
      <div className="w-full md:w-2/3 items-center md:items-start flex flex-col p-6 gap-4">
        <h1 className="text-3xl font-bold">title</h1>
        <p className="text-lg font-medium">
          Fu Panda 4,"Po is gearing up to become the spiritual leader of his
          Valley of Peace, but also needs someone to take his place as Dragon
          Warrior. As such, he will train a new kung fu practitioner for the
          spot and will encounter a villain called the Chameleon who conjures
          villains from the past. movie HD QUALITY, open this link
          leakedcinema.com",7.146,2340.977,2024-03-02
        </p>
        <div className="font-bold text-lg">
          <i className="fas fa-star mr-1 text" />
          Vote Average
        </div>
        <div className="font-bold text-lg">Popularity</div>
        <div className="font-bold text-lg">Releas Date</div>
      </div>
    </div>
  );
}
