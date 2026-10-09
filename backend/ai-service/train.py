from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torch import nn
from torch.utils.data import DataLoader, Dataset

from app.model import IMAGE_SIZE, SkinImageClassifier


class FolderDataset(Dataset):
    def __init__(self, root: Path, class_names: list[str]) -> None:
        self.samples: list[tuple[Path, int]] = []
        self.class_names = class_names
        for label, class_name in enumerate(class_names):
            for path in sorted((root / class_name).rglob("*")):
                if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                    self.samples.append((path, label))

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, int]:
        path, label = self.samples[index]
        with Image.open(path) as image:
            image = image.convert("RGB").resize((IMAGE_SIZE, IMAGE_SIZE))
            pixels = np.asarray(image).copy()
        tensor = torch.from_numpy(pixels).permute(2, 0, 1).float().div_(255.0)
        return tensor, label


def train(data_dir: Path, output: Path, epochs: int, batch_size: int) -> None:
    class_names = sorted(
        path.name for path in data_dir.iterdir() if path.is_dir()
    )
    if len(class_names) < 2:
        raise ValueError("Training data must contain at least two labeled class folders.")

    dataset = FolderDataset(data_dir, class_names)
    if not dataset:
        raise ValueError("No supported images found under the labeled class folders.")
    empty_classes = [
        class_name
        for label, class_name in enumerate(class_names)
        if not any(sample_label == label for _, sample_label in dataset.samples)
    ]
    if empty_classes:
        raise ValueError(f"No supported images found for classes: {', '.join(empty_classes)}")
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    model = SkinImageClassifier(len(class_names))
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = nn.CrossEntropyLoss()
    model.train()

    for epoch in range(epochs):
        total_loss = 0.0
        for images, labels in loader:
            optimizer.zero_grad()
            loss = loss_fn(model(images), labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * len(labels)
        print(f"Epoch {epoch + 1}/{epochs}: loss={total_loss / len(dataset):.4f}")

    output.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {"state_dict": model.state_dict(), "class_names": class_names},
        output,
    )
    print(f"Saved classifier checkpoint to {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the DermaCare image classifier.")
    parser.add_argument("--data", type=Path, required=True, help="ImageFolder dataset directory.")
    parser.add_argument("--output", type=Path, default=Path("models/skin_classifier.pt"))
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=16)
    args = parser.parse_args()
    if args.epochs < 1 or args.batch_size < 1:
        parser.error("--epochs and --batch-size must be positive.")
    train(args.data, args.output, args.epochs, args.batch_size)


if __name__ == "__main__":
    main()
