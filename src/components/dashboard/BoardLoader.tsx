const BoardLoader = () => {
  return (
    <div className="container-fluid">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div
              className="skeleton-box"
              style={{
                width: "90px",
                height: "40px",
                borderRadius: "14px",
                marginTop: "1px",
              }}
            />
            <div
              className="skeleton-box ms-4"
              style={{
                width: "200px",
                height: "32px",
                borderRadius: "6px",
                marginTop: "3px",
              }}
            />
          </div>

          <div
            className="skeleton-box"
            style={{
              width: "130px",
              height: "40px",
              borderRadius: "14px",
              marginTop: "1px",
            }}
          />
        </div>

        <div className="mt-3">
          <div className="row">
            {[5, 3, 2, 4].map((i) => (
              <div key={i} className="col-12 col-sm-6 col-md-3">
                <div
                  className="skeleton-column p-3"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "18px",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    className="skeleton-box mb-3"
                    style={{
                      width: "70%",
                      height: "24px",
                      borderRadius: "6px",
                    }}
                  />

                  {[...Array(i).keys()].map((j) => (
                    <div
                      key={j}
                      className="skeleton-box mb-2"
                      style={{
                        width: "100%",
                        height: `${80 + j * 10}px`,
                        borderRadius: "16px",
                        animationDelay: `${i * 0.1 + j * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
