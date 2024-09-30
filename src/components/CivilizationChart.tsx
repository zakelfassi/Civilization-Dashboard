import React, { useRef, useEffect, useState } from "react";
import { CivilizationData } from "../types/CivilizationData";
import * as d3 from "d3";
import { Tooltip } from "./Tooltip";
import { createPattern } from "../utils/patternGenerator";
import { Button, lighten } from "@mui/material";

interface CivilizationChartProps {
  data: CivilizationData[];
}

interface BubbleData {
  civilization: string;
  startYear: number;
  endYear: number;
  score: number;
  period: string;
  events: string;
  duration: number;
  calendarType: string;
}

const CivilizationChart: React.FC<CivilizationChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [highlightedCivilization, setHighlightedCivilization] = useState<
    string | null
  >(null);
  const [tooltips, setTooltips] = useState<
    {
      x: number;
      y: number;
      content: string;
    }[]
  >([]);
  const [visibleCivilizations, setVisibleCivilizations] = useState<Set<string>>(
    new Set()
  );

  // Move this color scale outside of the useEffect
  const civilizationColorScale = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(Array.from(new Set(data.map((d) => d.Civilization))));

  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    const updateChart = () => {
      const containerWidth = containerRef.current!.clientWidth;
      const containerHeight = containerRef.current!.clientHeight;
      const legendWidth = 240; // Width of the legend panel

      const margin = { top: 40, right: 20, bottom: 60, left: 80 };
      const width =
        containerWidth - margin.left - margin.right - legendWidth - 40; // Subtract legend width and padding
      const height = containerHeight - margin.top - margin.bottom;

      // Clear existing SVG content
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Process data
      const bubbleData: BubbleData[] = data.map((d) => ({
        civilization: d.Civilization,
        startYear: d["Start Date"],
        endYear: d["End Date"],
        score: d["Prosperity Score"],
        period: d["Historical Period"],
        events: d["Key Events"],
        duration: d["End Date"] - d["Start Date"],
        calendarType: d["Calendar Type"],
      }));

      // Sort bubbleData by start year
      bubbleData.sort((a, b) => a.startYear - b.startYear);

      // Set up scales
      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(bubbleData, (d) => d.startYear) || 0,
          d3.max(bubbleData, (d) => d.endYear) || 0,
        ])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(bubbleData, (d) => d.score) || 0,
          d3.max(bubbleData, (d) => d.score) || 0,
        ])
        .range([height, 0]);

      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(bubbleData, (d) => d.duration) || 0])
        .range([5, 40]);

      // Create patterns for calendar types
      const calendarTypes = Array.from(
        new Set(bubbleData.map((d) => d.calendarType))
      );

      d3.scaleOrdinal<string>()
        .domain(calendarTypes)
        .range(
          calendarTypes.map((type) =>
            createPattern(type, calendarTypes.indexOf(type))
          )
        );

      // Add patterns to SVG
      const defs = svg.append("defs");
      calendarTypes.forEach((type, i) => {
        const pattern = defs
          .append("pattern")
          .attr("id", `pattern-${i}`)
          .attr("patternUnits", "userSpaceOnUse")
          .attr("width", 20)
          .attr("height", 20);

        pattern
          .append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "white");

        pattern
          .append("path")
          .attr("d", createPattern(type, i))
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          .attr("transform", "scale(2)"); // Make the pattern larger
      });

      // Group bubbleData by civilization
      const civilizationGroups = d3.group(bubbleData, (d) => d.civilization);

      // Calculate total lifespan for each civilization
      const civilizationLifespans = new Map<string, number>();
      civilizationGroups.forEach((groupData, civilization) => {
        const totalLifespan = groupData.reduce((sum, d) => sum + d.duration, 0);
        civilizationLifespans.set(civilization, totalLifespan);
      });

      // Create a scale for line weights based on lifespans
      const maxLifespan = Math.max(...civilizationLifespans.values());
      const lineWeightScale = d3
        .scaleLinear()
        .domain([0, maxLifespan])
        .range([1, 5]); // Adjust this range to change the min and max line weights

      // Create a line generator
      const line = d3
        .line<BubbleData>()
        .x((d) => xScale((d.startYear + d.endYear) / 2))
        .y((d) => yScale(d.score))
        .curve(d3.curveCardinal);

      // Update visibleCivilizations state with all civilizations initially
      if (visibleCivilizations.size === 0) {
        setVisibleCivilizations(new Set(Array.from(civilizationGroups.keys())));
      }

      // Modify the line drawing code to respect visibility
      civilizationGroups.forEach((groupData, civilization) => {
        const sortedGroupData = groupData.sort(
          (a, b) => a.startYear - b.startYear
        );
        const civilizationLifespan =
          civilizationLifespans.get(civilization) || 0;
        const lineWeight = lineWeightScale(civilizationLifespan);

        svg
          .append("path")
          .datum(sortedGroupData)
          .attr("fill", "none")
          .attr("stroke", civilizationColorScale(civilization))
          .attr("stroke-width", lineWeight)
          .attr("stroke-opacity", 0.7)
          .attr(
            "class",
            `civilization-line civilization-line-${civilization.replace(
              /\s+/g,
              "-"
            )}`
          )
          .attr("d", line)
          .attr(
            "visibility",
            visibleCivilizations.has(civilization) ? "visible" : "hidden"
          );
      });

      // Modify the bubble drawing code to respect visibility
      svg
        .selectAll("circle")
        .data(bubbleData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale((d.startYear + d.endYear) / 2))
        .attr("cy", (d) => yScale(d.score))
        .attr("r", (d) => radiusScale(d.duration))
        .attr("fill", (d) => civilizationColorScale(d.civilization))
        .attr("opacity", 0.7)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5)
        .attr(
          "class",
          (d) =>
            `civilization-node civilization-${d.civilization.replace(
              /\s+/g,
              "-"
            )}`
        )
        .style("fill", (d) => {
          const patternId = `url(#pattern-${calendarTypes.indexOf(
            d.calendarType
          )})`;
          const color = civilizationColorScale(d.civilization);
          return `${color}${patternId}`;
        })
        .style("fill-opacity", 0.85) // Increase opacity to make patterns more visible
        .on("mouseover", function (event, d) {
          setHighlightedCivilization(d.civilization);
          highlightCivilization(d.civilization);
          showTooltip(event, d);
        })
        .on("mouseout", function () {
          setHighlightedCivilization(null);
          resetHighlight();
          hideTooltip();
        })
        .attr("visibility", (d) =>
          visibleCivilizations.has(d.civilization) ? "visible" : "hidden"
        );

      // Add axes
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat((d) => formatYear(d as number)));

      svg.append("g").call(d3.axisLeft(yScale));

      // Add labels
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Year");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Prosperity Score");

      // Update legend
      const legend = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .attr("transform", `translate(${width + 10}, 0)`)
        .selectAll("g")
        .data(calendarTypes)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legend
        .append("rect")
        .attr("x", 0)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", (d, i) => `url(#pattern-${i})`)
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5);

      legend
        .append("text")
        .attr("x", 25)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text((d) => d);

      // Add legend for civilization lines
      const lineLegend = svg
        .append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .attr("transform", `translate(${width + 10}, 100)`)
        .selectAll("g")
        .data(Array.from(civilizationGroups.keys()))
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      lineLegend
        .append("line")
        .attr("x1", 0)
        .attr("y1", 9.5)
        .attr("x2", 20)
        .attr("y2", 9.5)
        .attr("stroke", civilizationColorScale)
        .attr("stroke-width", (d) =>
          lineWeightScale(civilizationLifespans.get(d) || 0)
        );

      lineLegend
        .append("text")
        .attr("x", 25)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text((d) => d);

      // Function to show tooltip
      const showTooltip = (_event: MouseEvent, d: BubbleData) => {
        showCivilizationTooltips(d.civilization);
      };

      // Function to hide tooltip
      const hideTooltip = () => {
        setTooltips([]);
      };

      // Function to show tooltips for a civilization
      const showCivilizationTooltips = (civilization: string) => {
        const civilizationData = bubbleData.filter(
          (d) => d.civilization === civilization
        );
        const tooltipsData = civilizationData.map((d) => ({
          x: xScale((d.startYear + d.endYear) / 2),
          y: yScale(d.score),
          content: `
            <strong>${d.civilization}</strong><br>
            Period: ${d.period}<br>
            Years: ${formatYear(d.startYear)} - ${formatYear(d.endYear)}<br>
            Score: ${d.score}<br>
            Calendar Type: ${d.calendarType}<br>
            Events: ${d.events}
          `,
        }));
        setTooltips(tooltipsData);
      };

      // Function to highlight a civilization
      const highlightCivilization = (civilization: string) => {
        svg.selectAll("circle").attr("opacity", function (d) {
          return (d as BubbleData).civilization === civilization ? 1 : 0.3;
        });

        svg
          .selectAll<SVGPathElement, BubbleData[] | null>("path")
          .attr("stroke-opacity", (d) =>
            d && d.length > 0 && d[0].civilization === civilization ? 1 : 0.3
          )
          .attr("stroke-width", (d) => {
            if (!d || d.length === 0) return lineWeightScale(0);
            const civilizationLifespan =
              civilizationLifespans.get(d[0].civilization) || 0;
            return d[0].civilization === civilization
              ? lineWeightScale(civilizationLifespan) * 2
              : lineWeightScale(civilizationLifespan);
          });

        // Keep the bubbles of the hovered civilization at 100% opacity
        svg
          .selectAll("circle")
          .filter(function (d) {
            return (d as BubbleData).civilization === civilization;
          })
          .attr("opacity", 1);

        showCivilizationTooltips(civilization);
      };

      // Function to reset highlight
      const resetHighlight = () => {
        svg.selectAll("circle").attr("opacity", 0.7);
        svg
          .selectAll<SVGPathElement, BubbleData[] | null>("path")
          .attr("stroke-opacity", 0.7)
          .attr("stroke-width", (d: BubbleData[] | null) => {
            if (!d || d.length === 0) return lineWeightScale(0);
            const civilizationLifespan =
              civilizationLifespans.get(d[0].civilization) || 0;
            return lineWeightScale(civilizationLifespan);
          });
        setTooltips([]);
      };

      // Add event listeners to legend items
      lineLegend
        .on("mouseover", (event, d) => {
          setHighlightedCivilization(d);
          highlightCivilization(d);
          // Show tooltip for the first data point of the civilization
          const firstDataPoint = civilizationGroups.get(d)?.[0];
          if (firstDataPoint) {
            showTooltip(event, firstDataPoint);
          }
        })
        .on("mouseout", () => {
          setHighlightedCivilization(null);
          resetHighlight();
          hideTooltip();
        });

      // Add a line at prosperity score 0
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", yScale(0))
        .attr("x2", width)
        .attr("y2", yScale(0))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4")
        .attr("opacity", 0.5);
    };

    updateChart();

    const resizeObserver = new ResizeObserver(updateChart);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [data, highlightedCivilization]);

  // New effect to handle visibility changes
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Update visibility of lines
    svg
      .selectAll<SVGPathElement, BubbleData[]>("path.civilization-line")
      .attr("visibility", (d) =>
        visibleCivilizations.has(d[0].civilization) ? "visible" : "hidden"
      );

    // Update visibility of circles
    svg
      .selectAll<SVGCircleElement, BubbleData>("circle.civilization-node")
      .attr("visibility", (d) =>
        visibleCivilizations.has(d.civilization) ? "visible" : "hidden"
      );
  }, [visibleCivilizations]);

  // Helper function to format years
  const formatYear = (year: number | undefined) => {
    if (year === undefined) return "";
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  // Function to toggle visibility of a civilization
  const toggleCivilization = (civilization: string) => {
    setVisibleCivilizations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(civilization)) {
        newSet.delete(civilization);
      } else {
        newSet.add(civilization);
      }
      return newSet;
    });
  };

  // Function to turn off all civilizations
  const turnOffAllCivilizations = () => {
    setVisibleCivilizations(new Set());
  };

  // Function to turn on all civilizations
  const turnOnAllCivilizations = () => {
    setVisibleCivilizations(new Set(data.map((d) => d.Civilization)));
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "calc(100% - 260px)",
          position: "relative",
          marginRight: "20px",
        }}
      >
        <svg ref={svgRef}></svg>
        {tooltips.map((tooltip, index) => (
          <Tooltip
            key={index}
            x={tooltip.x}
            y={tooltip.y}
            content={tooltip.content}
          />
        ))}
      </div>
      <div
        style={{
          width: "240px",
          padding: "20px",
          overflowY: "auto",
          borderLeft: "1px solid #ccc",
          backgroundColor: "#f5f5f5",
          boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <Button
          onClick={turnOnAllCivilizations}
          variant="contained"
          fullWidth
          style={{
            marginBottom: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Show All
        </Button>
        <Button
          onClick={turnOffAllCivilizations}
          variant="contained"
          fullWidth
          style={{
            marginBottom: "20px",
            backgroundColor: "#F44336",
            color: "white",
          }}
        >
          Hide All
        </Button>
        {Array.from(new Set(data.map((d) => d.Civilization))).map(
          (civilization) => (
            <Button
              key={civilization}
              onClick={() => toggleCivilization(civilization)}
              variant="outlined"
              fullWidth
              style={{
                marginBottom: "10px",
                backgroundColor: visibleCivilizations.has(civilization)
                  ? civilizationColorScale(civilization)
                  : lighten(civilizationColorScale(civilization), 0.9), // Increased lightness
                color: visibleCivilizations.has(civilization)
                  ? "white"
                  : civilizationColorScale(civilization), // Use the original color for text
                justifyContent: "flex-start",
                textTransform: "none",
                padding: "10px",
                border: `1px solid ${civilizationColorScale(civilization)}`,
              }}
            >
              {civilization}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default CivilizationChart;
