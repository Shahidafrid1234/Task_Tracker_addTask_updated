import { useEffect, useRef, useState } from "react";
import { Button, Card } from "react-bootstrap";
import * as d3 from "d3";

const palettes = [
  ["#0b6efd", "#20c997", "#fd7e14", "#6f42c1", "#dc3545"],
  ["#198754", "#0dcaf0", "#ffc107", "#6610f2", "#d63384"],
  ["#0d6efd", "#6c757d", "#198754", "#fd7e14", "#e83e8c"],
];

const createNodes = (palette) =>
  [
    { id: "Focus", size: 30, group: 0 },
    { id: "Energy", size: 24, group: 1 },
    { id: "Flow", size: 22, group: 2 },
    { id: "Play", size: 20, group: 3 },
    { id: "Break", size: 18, group: 4 },
    { id: "Calm", size: 16, group: 1 },
    { id: "Spark", size: 16, group: 2 },
    { id: "Boost", size: 14, group: 3 },
    { id: "Reset", size: 14, group: 4 },
  ].map((node) => ({ ...node, color: palette[node.group % palette.length] }));

const links = [
  { source: "Focus", target: "Energy" },
  { source: "Focus", target: "Flow" },
  { source: "Focus", target: "Play" },
  { source: "Focus", target: "Break" },
  { source: "Energy", target: "Spark" },
  { source: "Flow", target: "Calm" },
  { source: "Play", target: "Boost" },
  { source: "Break", target: "Reset" },
  { source: "Spark", target: "Boost" },
  { source: "Calm", target: "Reset" },
];

function RecreationConstellation() {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [paletteIndex, setPaletteIndex] = useState(0);

  useEffect(() => {
    const svgElement = svgRef.current;
    const wrapperElement = wrapperRef.current;
    if (!svgElement || !wrapperElement) return undefined;

    const width = wrapperElement.clientWidth || 500;
    const height = 320;
    const palette = palettes[paletteIndex];

    const nodes = createNodes(palette);
    const linkData = links.map((link) => ({ ...link }));

    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("role", "img");

    const defs = svg.append("defs");
    const glow = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glow
      .append("feGaussianBlur")
      .attr("stdDeviation", "2.6")
      .attr("result", "coloredBlur");

    const merge = glow.append("feMerge");
    merge.append("feMergeNode").attr("in", "coloredBlur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(linkData)
          .id((d) => d.id)
          .distance(85)
      )
      .force("charge", d3.forceManyBody().strength(-160))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d) => d.size + 8));

    const link = svg
      .append("g")
      .attr("stroke", "#a5b4c6")
      .attr("stroke-opacity", 0.5)
      .selectAll("line")
      .data(linkData)
      .join("line")
      .attr("stroke-width", 1.6);

    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "grab")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    nodeGroup
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => d.color)
      .attr("fill-opacity", 0.9)
      .attr("filter", "url(#glow)")
      .on("mouseenter", function onMouseEnter() {
        d3.select(this).transition().duration(150).attr("r", (d) => d.size + 5);
      })
      .on("mouseleave", function onMouseLeave() {
        d3.select(this).transition().duration(150).attr("r", (d) => d.size);
      });

    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".32em")
      .attr("font-size", "11px")
      .attr("fill", "#f8f9fa")
      .attr("font-weight", 700)
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [paletteIndex]);

  return (
    <Card className="section-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2 gap-3 flex-wrap">
          <div>
            <Card.Title className="mb-1">Interactive Constellation</Card.Title>
            <p className="small text-muted mb-0">
              Drag nodes, explore links, and reshuffle colors for a live D3 scene.
            </p>
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setPaletteIndex((prev) => (prev + 1) % palettes.length)}
          >
            Shuffle Palette
          </Button>
        </div>
        <div className="constellation-wrap" ref={wrapperRef}>
          <svg ref={svgRef} className="constellation-svg" />
        </div>
      </Card.Body>
    </Card>
  );
}

export default RecreationConstellation;
