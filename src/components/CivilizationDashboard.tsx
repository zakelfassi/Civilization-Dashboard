import React, { useState, useEffect } from "react";
import { CivilizationData } from "../types/CivilizationData";
import Papa from "papaparse";
import { Box, Typography } from "@mui/material";
import CivilizationChart from "./CivilizationChart";

const CivilizationDashboard: React.FC = () => {
  const [civilizations, setCivilizations] = useState<CivilizationData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data.csv");
        const csvData = await response.text();
        Papa.parse<CivilizationData>(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          delimiter: ",",
          complete: (results) => {
            if (results.errors.length > 0) {
              setError(
                `CSV parsing errors: ${results.errors
                  .map((e) => e.message)
                  .join(", ")}`
              );
            } else {
              const expectedFields = Object.keys(results.data[0]).length;
              const validData = results.data.filter(
                (row) => Object.keys(row).length === expectedFields
              );
              if (validData.length !== results.data.length) {
                setError(
                  "Some rows have an incorrect number of fields and were skipped."
                );
              }
              setCivilizations(validData);
            }
          },
          error: (error: { message: string }) => {
            setError(`CSV parsing error: ${error.message}`);
          },
        });
      } catch (err) {
        setError(
          `Failed to load data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error
        </Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {civilizations.length > 0 ? (
        <CivilizationChart data={civilizations} />
      ) : (
        <Typography>Loading data...</Typography>
      )}
    </Box>
  );
};

export default CivilizationDashboard;
