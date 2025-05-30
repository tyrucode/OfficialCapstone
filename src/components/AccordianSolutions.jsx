import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const AccordionSolutions = () => {
    const [open, setOpen] = useState(solutions[0].id);
    const imgSrc = solutions.find((s) => s.id === open)?.imgSrc;
    return (
        <section className="px-8 py-12  text-white">
            <div className="w-full max-w-6xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-[1fr_350px]">
                <div className="flex flex-col gap-4">
                    {solutions.map((q) => (
                        <Solution {...q} key={q.id} open={open} setOpen={setOpen} index={q.id} />
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={imgSrc}
                        className="bg-zinc-700 rounded-2xl aspect-[4/3] lg:aspect-auto"
                        style={{
                            backgroundImage: `url(${imgSrc})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                </AnimatePresence>
            </div>
        </section>
    );
};

const Solution = ({ title, description, index, open, setOpen }) => {
    const isOpen = index === open;

    return (
        <div
            onClick={() => setOpen(index)}
            className="p-0.5 rounded-lg relative overflow-hidden cursor-pointer"
        >
            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "240px" : "72px",
                }}
                className="p-6 rounded-[7px] bg-zinc-800 flex flex-col justify-between relative z-20"
            >
                <div>
                    <motion.p
                        initial={false}
                        animate={{
                            color: isOpen ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 1)",
                        }}
                        className="text-xl font-medium w-fit bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
                    >
                        {title}
                    </motion.p>
                    <motion.p
                        initial={false}
                        animate={{
                            opacity: isOpen ? 1 : 0,
                        }}
                        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
                    >
                        {description}
                    </motion.p>
                </div>
                <motion.button
                    initial={false}
                    animate={{
                        opacity: isOpen ? 1 : 0,
                    }}
                    className="-ml-6 -mr-6 -mb-6 mt-4 py-2 rounded-b-md flex items-center justify-center gap-1 group transition-[gap] bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                >
                    <span>Learn more</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    opacity: isOpen ? 1 : 0,
                }}
                className="absolute inset-0 z-10 bg-gradient-to-r from-green-500 to-emerald-600"
            />
            <div className="absolute inset-0 z-0 bg-zinc-700" />
        </div>
    );
};

export default AccordionSolutions;

const solutions = [
    {
        id: 1,
        title: "How to sign up!",
        description:
            "Due to Spotify API limitations, you will need to provide your Spotify email so I can sign you up to play this game. You can send it to me by clicking the 'Learn More' button and sending me a message on LinkedIn!",
        imgSrc:
            "https://media.giphy.com/media/tOi4zkAikroTOBV9oy/giphy.gif?cid=ecf05e47x09kmr9aynozgsldr30qlareqd0rgxzupkjc4dzi&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    },
    {
        id: 2,
        title: "How to play!",
        description:
            "To play, first sign into your Spotify account. Then, choose a playlist from your library. You will have three guesses to guess the song based on a snippet of the song. If you guess the song correctly, you win and go on the leaderboard! If not, you can try again with another playlist.",
        imgSrc:
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNW41cGJ4dWo2MThqM2owaXpsNTVkcmRoNHY2YTdreDZzMW5kYXJrcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gQJyPqc6E4xoc/giphy.gif",
    },
    {
        id: 3,
        title: "Demo Video",
        description:
            "Dont feel like signing up? No problem! You can watch a demo video of the game by clicking the 'Learn More' button below. It will take you to a YouTube video that shows how the game works.",
        imgSrc:
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemlqa2FtNm9sbnF6NmNoMTc3MHMzODFibnVscTN3NGVyMG4xZ2YybiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1kkxWqT5nvLXupUTwK/giphy.gif",
    },
];
