import SearchIcon from '@mui/icons-material/Search';

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <div className="relative w-full">
            <label htmlFor="people-search" className="sr-only">Search people</label>
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-faint">
                <SearchIcon fontSize="small" aria-hidden="true" />
            </span>
            <input
                id="people-search"
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search people"
                className="field pl-10"
            />
        </div>
    )
}
