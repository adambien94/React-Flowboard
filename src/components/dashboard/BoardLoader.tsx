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
                className="fb-col-dot skeleton-box"
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
              <span
                style={{
                  display: "inline-flex",
                  width: 20,
                  justifyContent: "center",
                }}
              >
                <span
                  className="skeleton-box"
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: 4,
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
    </div>
  );
};

export default BoardLoader;
