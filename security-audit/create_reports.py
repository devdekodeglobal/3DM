"""Regenerate the current remediation report rather than the historical baseline."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name("update_reports.py")), run_name="__main__")
