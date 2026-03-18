const BoardLoader = () => {
  const placeholderColumns = [5, 3, 4, 2, 5];

  return (
    <div>
      <div
        className="fb-board ps-3 overflow-visible"
        style={{ opacity: "0.3" }}
      >
        {placeholderColumns.map((cardsCount, idx) => (
          <div key={idx} className="fb-column">
            <div className="fb-col-header">
              <span
                className="fb-col-dot skeleton-box "
                style={{ width: 10, height: 10 }}
              />
              <span className="flex-grow-1">
                <span
                  className="skeleton-box "
                  style={{
                    display: "inline-block",
                    width: "70%",
                    height: 16,
                    borderRadius: 6,
                  }}
                />
              </span>
              <span className="fb-col-count">
                <span
                  className="skeleton-box"
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 12,
                    borderRadius: 4,
                  }}
                />
              </span>
              <span className="fb-col-handle">
                <span
                  className="skeleton-box"
                  style={{
                    display: "inline-block",
                    width: 18,
                    height: 10,
                    borderRadius: 4,
                  }}
                />
              </span>
            </div>

            <div className="fb-cards-wrapper skeleton-column border-0">
              {Array.from({ length: cardsCount }).map((_, j) => (
                <div
                  key={j}
                  className="skeleton-box"
                  style={{
                    width: "100%",
                    height: 82 + j * 10,
                    borderRadius: 12,
                    animationDelay: `${idx * 0.12 + j * 0.06}s`,
                  }}
                />
              ))}

              <div className="mt-2 d-flex">
                <div
                  className="skeleton-box"
                  style={{
                    width: "60%",
                    height: 28,
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
  
          .skeleton-box {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.05) 100%
            );
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
  
          .skeleton-column {
            animation: fadeIn 0.3s ease-in;
          }
  
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(2px);
            }
          }
        `}</style>
    </div>
  );
};

export default BoardLoader;
