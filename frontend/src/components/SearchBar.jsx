const SearchBar = ({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    categories = [],
    sort,
    onSortChange,
}) => {
    return (
        <div className="w-full flex flex-col lg:flex-row gap-3 lg:items-center">
            {/* Search input */}
            <div className="relative flex-1">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                    />
                </svg>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="input-field pl-11"
                />
            </div>

            {/* Category select */}
            <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="input-field cursor-pointer min-w-[180px]"
            >
                <option value="All Categories">All Categories</option>
                {categories.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>

            {/* Sort */}
            <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="input-field cursor-pointer min-w-[170px]"
            >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A → Z</option>
                <option value="name_desc">Name: Z → A</option>
            </select>
        </div>
    );
};

export default SearchBar;
