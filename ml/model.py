"""Model interfaces for RegionalPulse.

The prototype deliberately separates the research architecture from demo inference.
Replace the deterministic implementation after validated regional healthcare data are available.
"""
from dataclasses import dataclass
from typing import Any

@dataclass
class ForecastOutput:
    demand: float
    occupancy: float
    risk_probability: float

class TemporalForecastModel:
    """Interface for a Temporal Fusion Transformer (TFT)."""
    def predict(self, temporal_features: Any) -> ForecastOutput:
        raise NotImplementedError

class SpatialGraphModel:
    """Interface for a Graph Attention Network (GAT)."""
    def propagate(self, node_features: Any, adjacency: Any) -> Any:
        raise NotImplementedError

class MultimodalFusion:
    """Combines temporal, spatial, environmental, event and surveillance embeddings."""
    def fuse(self, *modalities: Any) -> Any:
        raise NotImplementedError

class CapacityRisk:
    def __init__(self, threshold: float = 90.0): self.threshold = threshold
    def pressure(self, predicted_demand: float, available_capacity: float) -> float:
        return predicted_demand / max(1.0, available_capacity) * 100.0
    def gap(self, predicted_demand: float, available_capacity: float) -> float:
        return predicted_demand - available_capacity
