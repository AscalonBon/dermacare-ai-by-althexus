from __future__ import annotations

import os
from pathlib import Path

import torch
from torch import nn

IMAGE_SIZE = 224


class SkinImageClassifier(nn.Module):
    """Small classifier intended for training on a project-specific dataset."""

    def __init__(self, class_count: int) -> None:
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1)),
        )
        self.classifier = nn.Linear(128, class_count)

    def forward(self, image: torch.Tensor) -> torch.Tensor:
        return self.classifier(self.features(image).flatten(1))


class ModelRunner:
    def __init__(self) -> None:
        self.model_path = Path(os.getenv("MODEL_PATH", "models/skin_classifier.pt"))
        self.model: SkinImageClassifier | None = None
        self.class_names: list[str] = []

        if self.model_path.is_file():
            checkpoint = torch.load(self.model_path, map_location="cpu", weights_only=True)
            class_names = checkpoint.get("class_names")
            if not isinstance(class_names, list) or not class_names or not all(
                isinstance(name, str) for name in class_names
            ):
                raise ValueError("Model checkpoint must contain a non-empty class_names list.")

            model = SkinImageClassifier(len(class_names))
            model.load_state_dict(checkpoint["state_dict"])
            model.eval()
            self.model = model
            self.class_names = class_names

    def predict(self, image_tensor: torch.Tensor) -> dict[str, object] | None:
        if self.model is None:
            return None
        with torch.inference_mode():
            probabilities = torch.softmax(self.model(image_tensor.unsqueeze(0)), dim=1)[0]
        scores, indices = torch.topk(probabilities, min(3, len(self.class_names)))
        return {
            "status": "available",
            "predictions": [
                {"label": self.class_names[index], "score": round(float(score), 4)}
                for score, index in zip(scores.tolist(), indices.tolist())
            ],
        }
