import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
    { name: 'Audio', emoji: '🎧' },
    { name: 'Peripherals', emoji: '⌨️' },
    { name: 'Footwear', emoji: '👟' },
    { name: 'Books', emoji: '📚' },
    { name: 'Home', emoji: '🏡' },
    { name: 'Wearables', emoji: '⌚' },
    { name: 'Apparel', emoji: '👕' },
    { name: 'Bags', emoji: '🎒' },
    { name: 'Fitness', emoji: '🏋️' },
    { name: 'Kitchen', emoji: '🍳' },
];

const CategoryRail = () => (
    <div className="w-full">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {categories.map((c, i) => (
                <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="flex-shrink-0"
                >
                    <Link
                        to={`/products?category=${encodeURIComponent(c.name)}`}
                        className="flex flex-col items-center justify-center gap-1.5 w-[88px] h-[88px] rounded-2xl
                       bg-white dark:bg-ink-900 border border-slate-100 dark:border-ink-800
                       hover:shadow-md dark:hover:shadow-[0_0_24px_-10px_#0A9548] hover:-translate-y-1
                       transition-all duration-300"
                    >
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
                            {c.name}
                        </span>
                    </Link>
                </motion.div>
            ))}
        </div>
    </div>
);

export default CategoryRail;
