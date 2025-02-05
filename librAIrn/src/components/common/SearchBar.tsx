import { FC, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";

const SearchBar: FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [action, setAction] = useState<number>(0);
  const [showFilter, setShowFilter] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(
        `/search?query=${encodeURIComponent(searchTerm)}&action=${action}`
      );
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="container px-4 py-4 mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="소장 도서 검색하기"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pr-10 text-sm transition-colors border-2 border-gray-200 rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowFilter(!showFilter)}
                className="absolute transform -translate-y-1/2 right-3 top-1/2"
              >
                <Filter
                  className={`text-gray-400 transition-colors ${showFilter ? "text-primary" : ""}`}
                  size={20}
                />
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-3 text-white transition-colors rounded-lg bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2"
            >
              검색
            </button>
          </div>

          {/* 필터 드롭다운 */}
          {showFilter && (
            <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg right-20">
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setAction(0);
                    setShowFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${action === 0 ? "text-primary font-medium" : "text-gray-700"}`}
                >
                  제목으로 검색
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAction(1);
                    setShowFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${action === 1 ? "text-primary font-medium" : "text-gray-700"}`}
                >
                  작가로 검색
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAction(2);
                    setShowFilter(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${action === 2 ? "text-primary font-medium" : "text-gray-700"}`}
                >
                  출판사로 검색
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
