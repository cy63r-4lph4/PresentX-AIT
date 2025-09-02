interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
      <svg
        className="w-12 h-12 text-red-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M12 4.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5-3.358-7.5-7.5-7.5z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-red-600">
        Failed to load events
      </h3>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default Error;
