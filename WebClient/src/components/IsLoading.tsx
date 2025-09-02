
const IsLoading = () => {
  return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-50"></div>
        <p className="ml-4 text-indigo-700 text-lg font-medium animate-pulse">
          Loading events...
        </p>
      </div>
    );
}

export default IsLoading