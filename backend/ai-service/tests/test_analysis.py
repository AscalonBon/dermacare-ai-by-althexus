import io
import unittest

import numpy as np
import torch
from PIL import Image

from app.main import image_metrics, prepare_image
from app.model import ModelRunner


def make_png() -> bytes:
    output = io.BytesIO()
    Image.new("RGB", (320, 240), color=(160, 120, 100)).save(output, format="PNG")
    return output.getvalue()


class ImageAnalysisTests(unittest.TestCase):
    def test_prepares_supported_image_for_cv_and_torch(self) -> None:
        bgr_image, image_tensor = prepare_image(make_png(), "image/png")

        self.assertEqual(bgr_image.shape, (240, 320, 3))
        self.assertEqual(tuple(image_tensor.shape), (3, 224, 224))
        self.assertTrue(np.isfinite(image_tensor.numpy()).all())

    def test_rejects_mismatched_content_type(self) -> None:
        with self.assertRaisesRegex(ValueError, "does not match"):
            prepare_image(make_png(), "image/jpeg")

    def test_rejects_unsupported_content_type(self) -> None:
        with self.assertRaisesRegex(ValueError, "JPG, PNG, or WEBP"):
            prepare_image(make_png(), "image/gif")

    def test_calculates_non_diagnostic_visual_measurements(self) -> None:
        bgr_image, _ = prepare_image(make_png(), "image/png")
        metrics = image_metrics(bgr_image)

        self.assertEqual(metrics["image"], {"width": 320, "height": 240})
        self.assertIn("sharpness", metrics["quality"])
        self.assertIn("do not detect or diagnose", metrics["disclaimer"])

    def test_classifier_is_not_a_fake_prediction_without_weights(self) -> None:
        runner = ModelRunner()
        self.assertIsNone(runner.predict(torch.zeros((3, 224, 224))))


if __name__ == "__main__":
    unittest.main()
