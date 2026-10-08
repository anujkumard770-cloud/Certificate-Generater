/**
 * CodeNova Internship Certificate Generator
 * Pure Client-Side Batch Certificate Generator & PDF Engine
 * Zero Server Uploads • 100% Local Processing
 */

// ==========================================================================
// Application State
// ==========================================================================
const state = {
  templateImage: null,
  templateInfo: {
    name: '',
    width: 0,
    height: 0,
    aspectRatio: 1
  },
  students: [],
  selectedStudentIndex: -1, // -1 means Test Layout mode
  testLayoutName: 'Anuj Kumar Dubey',
  activeFieldKey: 'student_name',
  showBoundingBoxes: true,
  zoomLevel: 1.0,
  hasCustomConfig: false,
  
  // Dragging state
  drag: {
    isDragging: false,
    fieldKey: null,
    startX: 0,
    startY: 0,
    fieldStartX: 0,
    fieldStartY: 0
  },

  // Generated Certificates (Separate PDFs in memory)
  generatedCertificates: [], // Array of { id, student, blob, url, filename, status }
  isGenerating: false,

  // Dynamic Fields Definition & Config
  dynamicFields: {
    student_name: {
      key: 'student_name',
      label: 'Student Name',
      tag: '{{student_name}}',
      enabled: true,
      x: 960,
      y: 520,
      fontFamily: 'Playfair Display',
      fontSize: 56,
      fontWeight: '700',
      fontStyle: 'normal',
      color: '#0f172a',
      align: 'center',
      letterSpacing: 0.5,
      maxWidth: 950,
      autoScale: true
    },
    internship: {
      key: 'internship',
      label: 'Internship',
      tag: '{{internship}}',
      enabled: true,
      x: 960,
      y: 630,
      fontFamily: 'Poppins',
      fontSize: 34,
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#4f46e5',
      align: 'center',
      letterSpacing: 0,
      maxWidth: 800,
      autoScale: true
    },
    offer_letter: {
      key: 'offer_letter',
      label: 'Offer Letter',
      tag: '{{offer_letter}}',
      enabled: true,
      x: 320,
      y: 280,
      fontFamily: 'Poppins',
      fontSize: 22,
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#334155',
      align: 'left',
      letterSpacing: 0.5,
      maxWidth: 400,
      autoScale: false
    },
    issue_date: {
      key: 'issue_date',
      label: 'Issue Date',
      tag: '{{issue_date}}',
      enabled: true,
      x: 1600,
      y: 280,
      fontFamily: 'Poppins',
      fontSize: 22,
      fontWeight: '500',
      fontStyle: 'normal',
      color: '#334155',
      align: 'right',
      letterSpacing: 0,
      maxWidth: 400,
      autoScale: false
    },
    start_date: {
      key: 'start_date',
      label: 'Start Date',
      tag: '{{start_date}}',
      enabled: true,
      x: 680,
      y: 730,
      fontFamily: 'Poppins',
      fontSize: 22,
      fontWeight: '500',
      fontStyle: 'normal',
      color: '#475569',
      align: 'center',
      letterSpacing: 0,
      maxWidth: 350,
      autoScale: false
    },
    end_date: {
      key: 'end_date',
      label: 'End Date',
      tag: '{{end_date}}',
      enabled: true,
      x: 1240,
      y: 730,
      fontFamily: 'Poppins',
      fontSize: 22,
      fontWeight: '500',
      fontStyle: 'normal',
      color: '#475569',
      align: 'center',
      letterSpacing: 0,
      maxWidth: 350,
      autoScale: false
    },
    duration: {
      key: 'duration',
      label: 'Duration',
      tag: '{{duration}}',
      enabled: true,
      x: 960,
      y: 730,
      fontFamily: 'Poppins',
      fontSize: 22,
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#0f172a',
      align: 'center',
      letterSpacing: 0,
      maxWidth: 300,
      autoScale: false
    },
    mode: {
      key: 'mode',
      label: 'Mode',
      tag: '{{mode}}',
      enabled: true,
      x: 960,
      y: 810,
      fontFamily: 'Poppins',
      fontSize: 20,
      fontWeight: '600',
      fontStyle: 'normal',
      color: '#059669',
      align: 'center',
      letterSpacing: 1,
      maxWidth: 300,
      autoScale: false
    }
  }
};

// ==========================================================================
// DOM Elements
// ==========================================================================
const DOM = {
  // Canvas & Viewport
  canvas: document.getElementById('certificateCanvas'),
  ctx: document.getElementById('certificateCanvas').getContext('2d'),
  viewport: document.getElementById('canvasViewport'),
  stageWrapper: document.getElementById('canvasStageWrapper'),
  noTemplateOverlay: document.getElementById('noTemplateOverlay'),
  canvasResInfo: document.getElementById('canvasResInfo'),
  mouseCoordsInfo: document.getElementById('mouseCoordsInfo'),
  zoomLevelDisplay: document.getElementById('zoomLevelDisplay'),
  btnZoomIn: document.getElementById('btnZoomIn'),
  btnZoomOut: document.getElementById('btnZoomOut'),
  btnZoomReset: document.getElementById('btnZoomReset'),
  btnToggleBoundingBoxes: document.getElementById('btnToggleBoundingBoxes'),

  // Uploads
  templateDropzone: document.getElementById('templateDropzone'),
  templateInput: document.getElementById('templateInput'),
  templateFileInfo: document.getElementById('templateFileInfo'),
  templateFileName: document.getElementById('templateFileName'),
  templateDimensions: document.getElementById('templateDimensions'),
  
  spreadsheetDropzone: document.getElementById('spreadsheetDropzone'),
  spreadsheetInput: document.getElementById('spreadsheetInput'),
  spreadsheetFileInfo: document.getElementById('spreadsheetFileInfo'),
  spreadsheetFileName: document.getElementById('spreadsheetFileName'),
  spreadsheetCount: document.getElementById('spreadsheetCount'),

  // Header & Controls
  btnLoadDemo: document.getElementById('btnLoadDemo'),
  btnEmptyLoadDemo: document.getElementById('btnEmptyLoadDemo'),
  btnSaveConfig: document.getElementById('btnSaveConfig'),
  btnLoadConfig: document.getElementById('btnLoadConfig'),
  btnResetConfig: document.getElementById('btnResetConfig'),
  studentPreviewSelect: document.getElementById('studentPreviewSelect'),
  testLayoutGroup: document.getElementById('testLayoutGroup'),
  testLayoutNameInput: document.getElementById('testLayoutNameInput'),

  // Field List & Form Settings
  fieldPillsList: document.getElementById('fieldPillsList'),
  activeFieldLabel: document.getElementById('activeFieldLabel'),
  fieldEnabledInput: document.getElementById('fieldEnabledInput'),
  fieldXInput: document.getElementById('fieldXInput'),
  fieldYInput: document.getElementById('fieldYInput'),
  fieldFontFamily: document.getElementById('fieldFontFamily'),
  fieldFontSize: document.getElementById('fieldFontSize'),
  fieldFontWeight: document.getElementById('fieldFontWeight'),
  fieldFontStyle: document.getElementById('fieldFontStyle'),
  fieldColor: document.getElementById('fieldColor'),
  fieldColorHex: document.getElementById('fieldColorHex'),
  fieldAlignGroup: document.getElementById('fieldAlignGroup'),
  fieldLetterSpacing: document.getElementById('fieldLetterSpacing'),
  fieldMaxWidth: document.getElementById('fieldMaxWidth'),
  fieldAutoScale: document.getElementById('fieldAutoScale'),

  // Generation & Tabs
  readyStatusBadge: document.getElementById('readyStatusBadge'),
  btnGenerateAll: document.getElementById('btnGenerateAll'),
  btnSelectedCount: document.getElementById('btnSelectedCount'),
  exportQualitySelect: document.getElementById('exportQualitySelect'),
  qualityDpiBadge: document.getElementById('qualityDpiBadge'),
  generationProgressContainer: document.getElementById('generationProgressContainer'),
  progressStatusText: document.getElementById('progressStatusText'),
  progressCountText: document.getElementById('progressCountText'),
  progressBarFill: document.getElementById('progressBarFill'),
  progressSuccessAlert: document.getElementById('progressSuccessAlert'),
  downloadAllSection: document.getElementById('downloadAllSection'),
  btnDownloadAllSeparately: document.getElementById('btnDownloadAllSeparately'),
  generatedCountBadge: document.getElementById('generatedCountBadge'),
  generatedListContainer: document.getElementById('generatedListContainer'),

  // Students Table Tab
  tabButtons: document.querySelectorAll('.tab-btn'),
  tabStudentCount: document.getElementById('tabStudentCount'),
  importedSummaryText: document.getElementById('importedSummaryText'),
  selectAllCheckbox: document.getElementById('selectAllCheckbox'),
  studentSearchInput: document.getElementById('studentSearchInput'),
  studentsTableBody: document.getElementById('studentsTableBody'),

  // PDF Preview Modal
  pdfModal: document.getElementById('pdfModal'),
  pdfModalTitle: document.getElementById('pdfModalTitle'),
  pdfModalFrame: document.getElementById('pdfModalFrame'),
  pdfModalFilename: document.getElementById('pdfModalFilename'),
  btnModalClose: document.getElementById('btnModalClose'),
  btnModalDownload: document.getElementById('btnModalDownload'),

  // Toasts
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderFieldPills();
  syncSettingsFormWithActiveField();
  setupEventListeners();
  autoLoadSavedConfig();

  // Re-render canvas when web fonts finish downloading
  if (document.fonts) {
    document.fonts.ready.then(() => {
      renderCanvas();
    });
  }
});

// ==========================================================================
// Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
  // Upload Template
  DOM.templateInput.addEventListener('change', handleTemplateUpload);
  setupDropzone(DOM.templateDropzone, DOM.templateInput);

  // Upload Spreadsheet
  DOM.spreadsheetInput.addEventListener('change', handleSpreadsheetUpload);
  setupDropzone(DOM.spreadsheetDropzone, DOM.spreadsheetInput);

  // Demo Loaders
  DOM.btnLoadDemo.addEventListener('click', loadDemoData);
  DOM.btnEmptyLoadDemo.addEventListener('click', loadDemoData);

  // Config actions
  DOM.btnSaveConfig.addEventListener('click', saveConfiguration);
  DOM.btnLoadConfig.addEventListener('click', () => loadConfiguration(true));
  DOM.btnResetConfig.addEventListener('click', resetConfiguration);

  // Student Preview Dropdown
  DOM.studentPreviewSelect.addEventListener('change', (e) => {
    state.selectedStudentIndex = parseInt(e.target.value, 10);
    if (state.selectedStudentIndex === -1) {
      DOM.testLayoutGroup.classList.remove('hidden');
    } else {
      DOM.testLayoutGroup.classList.add('hidden');
    }
    renderCanvas();
  });

  // Test Name Input
  DOM.testLayoutNameInput.addEventListener('input', (e) => {
    state.testLayoutName = e.target.value;
    renderCanvas();
  });

  // Zoom controls
  DOM.btnZoomIn.addEventListener('click', () => adjustZoom(0.1));
  DOM.btnZoomOut.addEventListener('click', () => adjustZoom(-0.1));
  DOM.btnZoomReset.addEventListener('click', fitCanvasToViewport);

  // Toggle Bounding Boxes
  DOM.btnToggleBoundingBoxes.addEventListener('click', () => {
    state.showBoundingBoxes = !state.showBoundingBoxes;
    DOM.btnToggleBoundingBoxes.classList.toggle('active', state.showBoundingBoxes);
    DOM.btnToggleBoundingBoxes.textContent = state.showBoundingBoxes ? 'Guides: ON' : 'Guides: OFF';
    renderCanvas();
  });

  // Field Settings Form Inputs
  DOM.fieldEnabledInput.addEventListener('change', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.enabled = e.target.checked;
    renderFieldPills();
    renderCanvas();
  });

  DOM.fieldXInput.addEventListener('input', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.x = parseFloat(e.target.value) || 0;
    renderCanvas();
  });

  DOM.fieldYInput.addEventListener('input', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.y = parseFloat(e.target.value) || 0;
    renderCanvas();
  });

  DOM.fieldFontFamily.addEventListener('change', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.fontFamily = e.target.value;
    renderCanvas();
  });

  DOM.fieldFontSize.addEventListener('input', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.fontSize = Math.max(8, parseInt(e.target.value, 10) || 12);
    renderCanvas();
  });

  DOM.fieldFontWeight.addEventListener('change', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.fontWeight = e.target.value;
    renderCanvas();
  });

  DOM.fieldFontStyle.addEventListener('change', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.fontStyle = e.target.value;
    renderCanvas();
  });

  DOM.fieldColor.addEventListener('input', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.color = e.target.value;
    DOM.fieldColorHex.value = e.target.value.toUpperCase();
    renderCanvas();
  });

  DOM.fieldColorHex.addEventListener('change', (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const field = state.dynamicFields[state.activeFieldKey];
      field.color = val;
      DOM.fieldColor.value = val;
      renderCanvas();
    }
  });

  // Alignment buttons
  DOM.fieldAlignGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-toggle');
    if (!btn) return;
    DOM.fieldAlignGroup.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const field = state.dynamicFields[state.activeFieldKey];
    field.align = btn.dataset.align;
    renderCanvas();
  });

  DOM.fieldLetterSpacing.addEventListener('input', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.letterSpacing = parseFloat(e.target.value) || 0;
    renderCanvas();
  });

  DOM.fieldMaxWidth.addEventListener('input', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.maxWidth = Math.max(0, parseInt(e.target.value, 10) || 0);
    renderCanvas();
  });

  DOM.fieldAutoScale.addEventListener('change', (e) => {
    const field = state.dynamicFields[state.activeFieldKey];
    field.autoScale = e.target.checked;
    renderCanvas();
  });

  // Canvas Mouse & Touch Events (Drag-and-Drop field positioning)
  DOM.canvas.addEventListener('mousedown', handleCanvasMouseDown);
  window.addEventListener('mousemove', handleCanvasMouseMove);
  window.addEventListener('mouseup', handleCanvasMouseUp);

  // Touch Support for mobile / touchscreens
  DOM.canvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
  window.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
  window.addEventListener('touchend', handleCanvasTouchEnd);

  // Keyboard navigation for pixel nudging
  window.addEventListener('keydown', handleKeyDown);

  // Tabs
  DOM.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.tabButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Table selection & search
  DOM.selectAllCheckbox.addEventListener('change', handleSelectAllStudents);
  DOM.studentSearchInput.addEventListener('input', handleStudentSearch);

  // Export Quality selector listener
  if (DOM.exportQualitySelect) {
    DOM.exportQualitySelect.addEventListener('change', (e) => {
      const val = parseFloat(e.target.value);
      if (val >= 3.0) {
        DOM.qualityDpiBadge.textContent = '400 DPI Super HD';
        DOM.qualityDpiBadge.className = 'badge badge-success';
      } else if (val >= 2.5) {
        DOM.qualityDpiBadge.textContent = '300 DPI Ultra HD';
        DOM.qualityDpiBadge.className = 'badge badge-success';
      } else if (val >= 2.0) {
        DOM.qualityDpiBadge.textContent = '200 DPI High Res';
        DOM.qualityDpiBadge.className = 'badge badge-success';
      } else {
        DOM.qualityDpiBadge.textContent = '96 DPI Standard';
        DOM.qualityDpiBadge.className = 'badge';
      }
    });
  }

  // Batch Generation & Downloads
  DOM.btnGenerateAll.addEventListener('click', generateAllCertificates);
  DOM.btnDownloadAllSeparately.addEventListener('click', downloadAllCertificatesSeparately);

  // Modal Close
  DOM.btnModalClose.addEventListener('click', closePdfModal);
  DOM.pdfModal.addEventListener('click', (e) => {
    if (e.target === DOM.pdfModal) closePdfModal();
  });

  // Window resize to re-fit canvas if needed
  window.addEventListener('resize', debounce(() => {
    if (state.templateImage) fitCanvasToViewport();
  }, 150));
}

// Setup Drag & Drop files
function setupDropzone(dropzone, input) {
  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      input.files = e.dataTransfer.files;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

// ==========================================================================
// Template Upload & Image Handling
// ==========================================================================
function handleTemplateUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please upload a valid PNG, JPG, or JPEG image.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    loadTemplateImageFromUrl(event.target.result, file.name);
  };
  reader.readAsDataURL(file);
}

function loadTemplateImageFromUrl(url, fileName = 'template.png') {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    state.templateImage = img;
    state.templateInfo = {
      name: fileName,
      width: img.naturalWidth,
      height: img.naturalHeight,
      aspectRatio: img.naturalWidth / img.naturalHeight
    };

    // Update Canvas dimensions to exact original image dimensions
    DOM.canvas.width = img.naturalWidth;
    DOM.canvas.height = img.naturalHeight;

    // UI Updates
    DOM.templateFileName.textContent = fileName;
    DOM.templateDimensions.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`;
    DOM.templateFileInfo.classList.remove('hidden');
    DOM.noTemplateOverlay.classList.add('hidden');
    DOM.canvasResInfo.textContent = `Dimensions: ${img.naturalWidth} × ${img.naturalHeight} px`;

    // Smart repositioning if fields were uninitialized or default
    distributeDefaultCoordinates(img.naturalWidth, img.naturalHeight);

    // Fit canvas viewport to screen
    fitCanvasToViewport();
    renderCanvas();
    updateReadyStatus();
    showToast(`Template loaded: ${fileName} (${img.naturalWidth}×${img.naturalHeight}px)`, 'success');
  };
  img.onerror = () => {
    showToast('Failed to load image. Please select a valid PNG/JPG file.', 'error');
  };
  img.src = url;
}

// Adjust default field positions relative to original image size if needed
function distributeDefaultCoordinates(w, h) {
  const scaleX = w / 1920;
  const scaleY = h / 1080;
  
  // Only apply scale if user hasn't explicitly customized yet
  if (!state.hasCustomConfig) {
    state.dynamicFields.student_name.x = Math.round(w / 2);
    state.dynamicFields.student_name.y = Math.round(h * 0.48);
    state.dynamicFields.student_name.fontSize = Math.round(56 * Math.min(scaleX, scaleY));
    state.dynamicFields.student_name.maxWidth = Math.round(w * 0.7);

    state.dynamicFields.internship.x = Math.round(w / 2);
    state.dynamicFields.internship.y = Math.round(h * 0.58);
    state.dynamicFields.internship.fontSize = Math.round(34 * Math.min(scaleX, scaleY));

    state.dynamicFields.offer_letter.x = Math.round(w * 0.16);
    state.dynamicFields.offer_letter.y = Math.round(h * 0.26);

    state.dynamicFields.issue_date.x = Math.round(w * 0.84);
    state.dynamicFields.issue_date.y = Math.round(h * 0.26);

    state.dynamicFields.start_date.x = Math.round(w * 0.35);
    state.dynamicFields.start_date.y = Math.round(h * 0.68);

    state.dynamicFields.duration.x = Math.round(w * 0.5);
    state.dynamicFields.duration.y = Math.round(h * 0.68);

    state.dynamicFields.end_date.x = Math.round(w * 0.65);
    state.dynamicFields.end_date.y = Math.round(h * 0.68);

    state.dynamicFields.mode.x = Math.round(w * 0.5);
    state.dynamicFields.mode.y = Math.round(h * 0.75);

    syncSettingsFormWithActiveField();
  }
}

// ==========================================================================
// Spreadsheet Import (CSV / XLSX)
// ==========================================================================
function handleSpreadsheetUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const ext = fileName.split('.').pop().toLowerCase();

  if (ext === 'csv') {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          processParsedData(results.data, fileName);
        } else {
          showToast('CSV file is empty or formatted incorrectly.', 'error');
        }
      },
      error: (err) => {
        showToast('Error reading CSV: ' + err.message, 'error');
      }
    });
  } else if (ext === 'xlsx' || ext === 'xls') {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // raw: false ensures formatted date strings (e.g., '8 October 2026') rather than numeric serials
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
        processParsedData(jsonData, fileName);
      } catch (err) {
        showToast('Error reading Excel spreadsheet: ' + err.message, 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    showToast('Unsupported file format. Please upload CSV or XLSX.', 'error');
  }
}

// Intelligent column detection and data normalization
function processParsedData(rawRows, fileName) {
  if (!rawRows || rawRows.length === 0) {
    showToast('Spreadsheet appears to be empty.', 'error');
    return;
  }

  // Detect column mapping from the keys of the first row
  const firstRow = rawRows[0];
  const keys = Object.keys(firstRow);

  const columnMap = {
    name: findMatchingKey(keys, [
      /^student\s*name$/i,
      /^candidate\s*name$/i,
      /^full\s*name$/i,
      /^name$/i,
      /student.*name/i,
      /candidate.*name/i,
      /student/i
    ]),
    internship: findMatchingKey(keys, [
      /^internship$/i,
      /^domain$/i,
      /^track$/i,
      /^course$/i,
      /^role$/i,
      /internship.*domain/i,
      /internship/i
    ]),
    offerLetter: findMatchingKey(keys, [
      /^offer\s*letter$/i,
      /^offer\s*letter\s*no$/i,
      /^offer\s*id$/i,
      /^ol\s*no$/i,
      /^reference\s*no$/i,
      /offer.*letter/i,
      /offer/i
    ]),
    issueDate: findMatchingKey(keys, [
      /^issue\s*date$/i,
      /^date\s*of\s*issue$/i,
      /^issued\s*on$/i,
      /issue.*date/i,
      /issue/i
    ]),
    startDate: findMatchingKey(keys, [
      /^start\s*date$/i,
      /^from\s*date$/i,
      /^starting\s*date$/i,
      /start.*date/i,
      /from/i
    ]),
    endDate: findMatchingKey(keys, [
      /^end\s*date$/i,
      /^to\s*date$/i,
      /^completion\s*date$/i,
      /end.*date/i,
      /to/i
    ]),
    duration: findMatchingKey(keys, [
      /^duration$/i,
      /^period$/i,
      /^tenure$/i,
      /duration/i,
      /weeks/i
    ]),
    mode: findMatchingKey(keys, [
      /^mode$/i,
      /^internship\s*mode$/i,
      /^work\s*mode$/i,
      /^type$/i,
      /mode/i,
      /location/i
    ])
  };

  // Fallback if header names are generic (e.g. __EMPTY, Col1, or raw A, B, C...)
  if (!columnMap.name && keys.length >= 1) {
    columnMap.name = keys[0];
  }
  if (!columnMap.internship && keys.length >= 2) {
    columnMap.internship = keys[1];
  }
  if (!columnMap.offerLetter && keys.length >= 3) {
    columnMap.offerLetter = keys[2];
  }
  if (!columnMap.issueDate && keys.length >= 4) {
    columnMap.issueDate = keys[3];
  }
  if (!columnMap.startDate && keys.length >= 5) {
    columnMap.startDate = keys[4];
  }
  if (!columnMap.endDate && keys.length >= 6) {
    columnMap.endDate = keys[5];
  }
  if (!columnMap.duration && keys.length >= 7) {
    columnMap.duration = keys[6];
  }
  if (!columnMap.mode && keys.length >= 8) {
    columnMap.mode = keys[7];
  }

  const processedStudents = [];
  rawRows.forEach((row, index) => {
    const rawName = columnMap.name ? row[columnMap.name] : '';
    const name = String(rawName || '').trim();

    // Skip empty names or duplicate headers
    if (!name || name.toLowerCase() === 'student name' || name.toLowerCase() === 'name') return;

    processedStudents.push({
      id: index + 1,
      name: name,
      internship: String(columnMap.internship ? row[columnMap.internship] : '').trim(),
      offerLetter: String(columnMap.offerLetter ? row[columnMap.offerLetter] : `CN-OL-${200 + index}`).trim(),
      issueDate: String(columnMap.issueDate ? row[columnMap.issueDate] : '').trim(),
      startDate: String(columnMap.startDate ? row[columnMap.startDate] : '').trim(),
      endDate: String(columnMap.endDate ? row[columnMap.endDate] : '').trim(),
      duration: String(columnMap.duration ? row[columnMap.duration] : '').trim(),
      mode: String(columnMap.mode ? row[columnMap.mode] : '').trim(),
      selected: true,
      status: 'Pending'
    });
  });

  if (processedStudents.length === 0) {
    showToast('No valid student records found with non-empty names.', 'error');
    return;
  }

  state.students = processedStudents;
  state.generatedCertificates = []; // Reset previous run

  // Update UI
  DOM.spreadsheetFileName.textContent = fileName;
  DOM.spreadsheetCount.textContent = `${processedStudents.length} students`;
  DOM.spreadsheetFileInfo.classList.remove('hidden');
  DOM.importedSummaryText.textContent = `${processedStudents.length} students imported`;
  DOM.tabStudentCount.textContent = processedStudents.length;

  populateStudentPreviewDropdown();
  renderStudentsTable();
  updateReadyStatus();
  renderGeneratedList();

  showToast(`Successfully imported ${processedStudents.length} students from ${fileName}!`, 'success');
}

function findMatchingKey(keys, regexList) {
  for (const regex of regexList) {
    for (const key of keys) {
      if (regex.test(key.trim())) {
        return key;
      }
    }
  }
  return null;
}

// Populate the Student Preview selector on the canvas toolbar
function populateStudentPreviewDropdown() {
  DOM.studentPreviewSelect.innerHTML = '<option value="-1">-- Test Layout Mode --</option>';
  state.students.forEach((student, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${student.name} (${student.offerLetter || student.internship || '#' + (idx + 1)})`;
    DOM.studentPreviewSelect.appendChild(opt);
  });
}

// Render the Data Preview Table (Tab 2)
function renderStudentsTable() {
  const searchTerm = DOM.studentSearchInput.value.toLowerCase().trim();
  const filtered = state.students.filter(s => {
    return s.name.toLowerCase().includes(searchTerm) || 
           s.offerLetter.toLowerCase().includes(searchTerm) ||
           s.internship.toLowerCase().includes(searchTerm);
  });

  if (filtered.length === 0) {
    DOM.studentsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-cell">No students match your search criteria.</td>
      </tr>
    `;
    return;
  }

  let html = '';
  filtered.forEach(student => {
    const isSelected = student.selected;
    html += `
      <tr class="${isSelected ? 'selected' : ''}" data-student-id="${student.id}">
        <td>
          <input type="checkbox" class="student-row-checkbox" data-student-id="${student.id}" ${isSelected ? 'checked' : ''}>
        </td>
        <td style="font-weight: 600;">${escapeHtml(student.name)}</td>
        <td>${escapeHtml(student.internship || '-')}</td>
        <td><span class="badge">${escapeHtml(student.offerLetter || '-')}</span></td>
        <td>${escapeHtml(student.duration || '-')}</td>
        <td>${escapeHtml(student.mode || '-')}</td>
        <td>
          <span class="badge ${student.status === 'Success' ? 'badge-success' : ''}">${student.status}</span>
        </td>
      </tr>
    `;
  });

  DOM.studentsTableBody.innerHTML = html;

  // Add checkbox toggle listeners
  DOM.studentsTableBody.querySelectorAll('.student-row-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const studentId = parseInt(e.target.dataset.studentId, 10);
      const student = state.students.find(s => s.id === studentId);
      if (student) {
        student.selected = e.target.checked;
        const tr = e.target.closest('tr');
        if (tr) tr.classList.toggle('selected', student.selected);
        updateReadyStatus();
      }
    });
  });
}

function handleSelectAllStudents(e) {
  const checked = e.target.checked;
  state.students.forEach(s => s.selected = checked);
  renderStudentsTable();
  updateReadyStatus();
}

function handleStudentSearch() {
  renderStudentsTable();
}

// ==========================================================================
// Dynamic Fields UI & Form Management
// ==========================================================================
function renderFieldPills() {
  DOM.fieldPillsList.innerHTML = '';
  
  Object.values(state.dynamicFields).forEach(field => {
    const pill = document.createElement('div');
    pill.className = `field-pill ${field.key === state.activeFieldKey ? 'active' : ''}`;
    pill.dataset.key = field.key;

    pill.innerHTML = `
      <div class="field-pill-left">
        <input type="checkbox" class="field-visibility-cb" data-key="${field.key}" ${field.enabled ? 'checked' : ''} title="Toggle field visibility">
        <span>${field.label}</span>
        <span class="field-pill-tag">${field.tag}</span>
      </div>
      <div class="field-pill-coords">${Math.round(field.x)}, ${Math.round(field.y)}</div>
    `;

    pill.addEventListener('click', (e) => {
      if (e.target.classList.contains('field-visibility-cb')) return;
      setActiveField(field.key);
    });

    const cb = pill.querySelector('.field-visibility-cb');
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      field.enabled = e.target.checked;
      if (field.key === state.activeFieldKey) {
        DOM.fieldEnabledInput.checked = field.enabled;
      }
      renderCanvas();
    });

    DOM.fieldPillsList.appendChild(pill);
  });
}

function setActiveField(key) {
  if (!state.dynamicFields[key]) return;
  state.activeFieldKey = key;
  renderFieldPills();
  syncSettingsFormWithActiveField();
  renderCanvas();
}

function syncSettingsFormWithActiveField() {
  const field = state.dynamicFields[state.activeFieldKey];
  if (!field) return;

  DOM.activeFieldLabel.textContent = field.label;
  DOM.fieldEnabledInput.checked = field.enabled;
  DOM.fieldXInput.value = Math.round(field.x);
  DOM.fieldYInput.value = Math.round(field.y);
  DOM.fieldFontFamily.value = field.fontFamily;
  DOM.fieldFontSize.value = field.fontSize;
  DOM.fieldFontWeight.value = field.fontWeight;
  DOM.fieldFontStyle.value = field.fontStyle;
  DOM.fieldColor.value = field.color;
  DOM.fieldColorHex.value = field.color.toUpperCase();
  DOM.fieldLetterSpacing.value = field.letterSpacing || 0;
  DOM.fieldMaxWidth.value = field.maxWidth || 0;
  DOM.fieldAutoScale.checked = !!field.autoScale;

  // Alignment buttons
  DOM.fieldAlignGroup.querySelectorAll('.btn-toggle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.align === field.align);
  });
}

// ==========================================================================
// Canvas Rendering & Drag-and-Drop System
// ==========================================================================
function renderCanvas() {
  const { canvas, ctx } = DOM;
  if (!canvas.width || !canvas.height) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Template Image Background
  if (state.templateImage) {
    ctx.drawImage(state.templateImage, 0, 0, canvas.width, canvas.height);
  } else {
    drawPlaceholderBackground(ctx, canvas.width, canvas.height);
  }

  // 2. Determine Data Source (Selected Student or Test Layout Mode)
  const data = getActiveRenderData();

  // 3. Draw All Dynamic Fields
  Object.values(state.dynamicFields).forEach(field => {
    if (!field.enabled) return;

    const rawText = data[field.key] || '';
    if (!rawText) return;

    // Render Text with typography, letter spacing, alignment, and auto-scale
    const { renderedX, renderedY, width, height, fontSize } = drawDynamicFieldText(ctx, field, rawText);

    // Save computed bounding box for mouse hit testing
    field.boundingBox = {
      x: renderedX,
      y: renderedY,
      width: width,
      height: height,
      fontSize: fontSize
    };

    // 4. Draw Guide / Bounding Box if enabled
    if (state.showBoundingBoxes) {
      const isActive = field.key === state.activeFieldKey;
      drawBoundingBox(ctx, field, isActive);
    }
  });
}

// Get the actual data to render on canvas
function getActiveRenderData() {
  if (state.selectedStudentIndex >= 0 && state.students[state.selectedStudentIndex]) {
    const s = state.students[state.selectedStudentIndex];
    return {
      student_name: s.name,
      internship: s.internship,
      offer_letter: s.offerLetter,
      issue_date: s.issueDate,
      start_date: s.startDate,
      end_date: s.endDate,
      duration: s.duration,
      mode: s.mode
    };
  }

  // Test Layout Mode
  return {
    student_name: state.testLayoutName || 'Anuj Kumar Dubey',
    internship: 'AI / Machine Learning',
    offer_letter: 'CN-OL-202',
    issue_date: '8 October 2026',
    start_date: '10 October 2026',
    end_date: '6 November 2026',
    duration: '4 Weeks',
    mode: 'Remote'
  };
}

// Core Dynamic Text Drawing on Canvas
function drawDynamicFieldText(ctx, field, text) {
  ctx.save();

  let fontSize = field.fontSize;
  ctx.font = `${field.fontStyle} ${field.fontWeight} ${fontSize}px "${field.fontFamily}", sans-serif`;

  // Letter Spacing (supported in modern Canvas context)
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = `${field.letterSpacing || 0}px`;
  }

  let textMetrics = ctx.measureText(text);
  let measuredWidth = textMetrics.width;

  // Auto-scaling for Long Names / Long Strings exceeding Max Width
  if (field.maxWidth > 0 && field.autoScale && measuredWidth > field.maxWidth) {
    const scale = field.maxWidth / measuredWidth;
    fontSize = Math.max(10, Math.floor(fontSize * scale));
    ctx.font = `${field.fontStyle} ${field.fontWeight} ${fontSize}px "${field.fontFamily}", sans-serif`;
    textMetrics = ctx.measureText(text);
    measuredWidth = textMetrics.width;
  }

  ctx.fillStyle = field.color;
  ctx.textAlign = field.align;
  ctx.textBaseline = 'middle';

  // Draw the text
  ctx.fillText(text, field.x, field.y);

  ctx.restore();

  // Calculate bounding box for hit-testing and guides
  const fontHeight = fontSize * 1.2;
  let boxX = field.x;
  if (field.align === 'center') {
    boxX = field.x - measuredWidth / 2;
  } else if (field.align === 'right') {
    boxX = field.x - measuredWidth;
  }
  const boxY = field.y - fontHeight / 2;

  return {
    renderedX: boxX,
    renderedY: boxY,
    width: measuredWidth,
    height: fontHeight,
    fontSize: fontSize
  };
}

// Draw visual bounding box and drag handles on Canvas
function drawBoundingBox(ctx, field, isActive) {
  if (!field.boundingBox) return;
  const { x, y, width, height } = field.boundingBox;
  const pad = 6;

  ctx.save();
  ctx.setLineDash(isActive ? [] : [4, 4]);
  ctx.lineWidth = isActive ? 2 : 1;
  ctx.strokeStyle = isActive ? '#4f46e5' : 'rgba(79, 70, 229, 0.4)';
  ctx.strokeRect(x - pad, y - pad, width + pad * 2, height + pad * 2);

  if (isActive) {
    // Fill subtle active background
    ctx.fillStyle = 'rgba(79, 70, 229, 0.08)';
    ctx.fillRect(x - pad, y - pad, width + pad * 2, height + pad * 2);

    // Corner Handles
    const handleSize = 6;
    ctx.fillStyle = '#4f46e5';
    [
      [x - pad, y - pad],
      [x + width + pad, y - pad],
      [x - pad, y + height + pad],
      [x + width + pad, y + height + pad]
    ].forEach(([hx, hy]) => {
      ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
    });

    // Small field badge on top of box
    ctx.fillStyle = '#4f46e5';
    ctx.font = '600 11px sans-serif';
    ctx.setLineDash([]);
    const tagText = `${field.label} (${Math.round(field.x)}, ${Math.round(field.y)})`;
    const tagMetrics = ctx.measureText(tagText);
    const tagWidth = tagMetrics.width + 10;
    const tagHeight = 18;
    const tagY = y - pad - tagHeight;
    ctx.fillRect(x - pad, tagY, tagWidth, tagHeight);
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(tagText, x - pad + 5, tagY + tagHeight / 2);
  }

  ctx.restore();
}

// Placeholder background if no image is loaded
function drawPlaceholderBackground(ctx, w, h) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, w, h);
  
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Upload Certificate Background Template', w / 2, h / 2 - 40);
  ctx.font = '20px sans-serif';
  ctx.fillText('Use the left panel or click "Load Demo Data"', w / 2, h / 2 + 20);
}

// Convert screen mouse coordinates to full canvas pixel coordinates
function getCanvasMouseCoords(e) {
  const rect = DOM.canvas.getBoundingClientRect();
  const scaleX = DOM.canvas.width / rect.width;
  const scaleY = DOM.canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

// Find field under mouse cursor
function hitTestFields(mouseCoords) {
  const pad = 12; // generous hit zone
  // Check active field first for immediate responsiveness
  const active = state.dynamicFields[state.activeFieldKey];
  if (active && active.enabled && active.boundingBox) {
    const { x, y, width, height } = active.boundingBox;
    if (mouseCoords.x >= x - pad && mouseCoords.x <= x + width + pad &&
        mouseCoords.y >= y - pad && mouseCoords.y <= y + height + pad) {
      return active;
    }
  }

  // Check all other enabled fields
  const fields = Object.values(state.dynamicFields);
  for (let i = fields.length - 1; i >= 0; i--) {
    const f = fields[i];
    if (!f.enabled || !f.boundingBox) continue;
    const { x, y, width, height } = f.boundingBox;
    if (mouseCoords.x >= x - pad && mouseCoords.x <= x + width + pad &&
        mouseCoords.y >= y - pad && mouseCoords.y <= y + height + pad) {
      return f;
    }
  }
  return null;
}

// Canvas Mouse Down: Start Drag
function handleCanvasMouseDown(e) {
  if (e.button !== 0) return; // Left click only
  const coords = getCanvasMouseCoords(e);
  startFieldDrag(coords);
}

// Touch Event Handlers
function handleCanvasTouchStart(e) {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const coords = getCanvasMouseCoords(touch);
    if (startFieldDrag(coords)) {
      e.preventDefault();
    }
  }
}

function handleCanvasTouchMove(e) {
  if (state.drag.isDragging && e.touches.length === 1) {
    e.preventDefault();
    const touch = e.touches[0];
    const coords = getCanvasMouseCoords(touch);
    updateFieldDrag(coords);
  }
}

function handleCanvasTouchEnd() {
  handleCanvasMouseUp();
}

function startFieldDrag(coords) {
  const hitField = hitTestFields(coords);
  if (hitField) {
    setActiveField(hitField.key);
    state.drag.isDragging = true;
    state.drag.fieldKey = hitField.key;
    state.drag.startX = coords.x;
    state.drag.startY = coords.y;
    state.drag.fieldStartX = hitField.x;
    state.drag.fieldStartY = hitField.y;
    DOM.canvas.style.cursor = 'grabbing';
    return true;
  }
  return false;
}

// Canvas Mouse Move: Dragging & Hover Cursor
function handleCanvasMouseMove(e) {
  const coords = getCanvasMouseCoords(e);
  DOM.mouseCoordsInfo.textContent = `X: ${Math.round(coords.x)}, Y: ${Math.round(coords.y)}`;

  if (state.drag.isDragging && state.drag.fieldKey) {
    updateFieldDrag(coords);
  } else {
    // Hover hit test for cursor style
    const hitField = hitTestFields(coords);
    DOM.canvas.style.cursor = hitField ? 'grab' : 'crosshair';
  }
}

function updateFieldDrag(coords) {
  const dx = coords.x - state.drag.startX;
  const dy = coords.y - state.drag.startY;
  const field = state.dynamicFields[state.drag.fieldKey];

  // Constrain within canvas bounds
  field.x = Math.max(0, Math.min(DOM.canvas.width, Math.round(state.drag.fieldStartX + dx)));
  field.y = Math.max(0, Math.min(DOM.canvas.height, Math.round(state.drag.fieldStartY + dy)));

  // Sync input values
  DOM.fieldXInput.value = field.x;
  DOM.fieldYInput.value = field.y;

  // Update coordinate text on pill
  const pill = DOM.fieldPillsList.querySelector(`[data-key="${field.key}"] .field-pill-coords`);
  if (pill) pill.textContent = `${field.x}, ${field.y}`;

  renderCanvas();
}

// Canvas Mouse Up: Stop Drag
function handleCanvasMouseUp() {
  if (state.drag.isDragging) {
    state.drag.isDragging = false;
    state.drag.fieldKey = null;
    DOM.canvas.style.cursor = 'grab';
    renderFieldPills();
  }
}

// Keyboard Arrow Nudging
function handleKeyDown(e) {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  const active = state.dynamicFields[state.activeFieldKey];
  if (!active || !active.enabled) return;

  const step = e.shiftKey ? 10 : 1;
  let handled = false;

  if (e.key === 'ArrowLeft') {
    active.x = Math.max(0, active.x - step);
    handled = true;
  } else if (e.key === 'ArrowRight') {
    active.x = Math.min(DOM.canvas.width, active.x + step);
    handled = true;
  } else if (e.key === 'ArrowUp') {
    active.y = Math.max(0, active.y - step);
    handled = true;
  } else if (e.key === 'ArrowDown') {
    active.y = Math.min(DOM.canvas.height, active.y + step);
    handled = true;
  }

  if (handled) {
    e.preventDefault();
    DOM.fieldXInput.value = active.x;
    DOM.fieldYInput.value = active.y;
    renderCanvas();
    renderFieldPills();
  }
}

// Zoom and Pan
function fitCanvasToViewport() {
  if (!DOM.canvas.width || !DOM.canvas.height) return;
  const vpRect = DOM.viewport.getBoundingClientRect();
  const availableW = vpRect.width - 48; // padding
  const availableH = vpRect.height - 48;

  const scaleW = availableW / DOM.canvas.width;
  const scaleH = availableH / DOM.canvas.height;
  const scale = Math.min(scaleW, scaleH, 1.0); // Don't upscale past 100% by default

  state.zoomLevel = Math.max(0.2, Math.min(scale, 2.0));
  applyZoom();
}

function adjustZoom(delta) {
  state.zoomLevel = Math.max(0.2, Math.min(2.5, state.zoomLevel + delta));
  applyZoom();
}

function applyZoom() {
  DOM.canvas.style.width = `${Math.round(DOM.canvas.width * state.zoomLevel)}px`;
  DOM.canvas.style.height = `${Math.round(DOM.canvas.height * state.zoomLevel)}px`;
  DOM.zoomLevelDisplay.textContent = `${Math.round(state.zoomLevel * 100)}%`;
}

// ==========================================================================
// Save / Load Configuration (localStorage)
// ==========================================================================
const STORAGE_KEY = 'codenova_certificate_generator_config';

function saveConfiguration() {
  try {
    const config = {
      templateInfo: state.templateInfo,
      fields: state.dynamicFields,
      testLayoutName: state.testLayoutName
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    state.hasCustomConfig = true;
    showToast('Configuration saved to browser storage successfully!', 'success');
  } catch (err) {
    showToast('Failed to save configuration: ' + err.message, 'error');
  }
}

function loadConfiguration(notify = false) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      if (notify) showToast('No saved configuration found in this browser.', 'warning');
      return false;
    }
    const config = JSON.parse(raw);
    if (config.fields) {
      Object.keys(state.dynamicFields).forEach(key => {
        if (config.fields[key]) {
          state.dynamicFields[key] = { ...state.dynamicFields[key], ...config.fields[key] };
        }
      });
    }
    if (config.testLayoutName) {
      state.testLayoutName = config.testLayoutName;
      DOM.testLayoutNameInput.value = config.testLayoutName;
    }
    state.hasCustomConfig = true;
    renderFieldPills();
    syncSettingsFormWithActiveField();
    renderCanvas();
    if (notify) showToast('Saved configuration loaded successfully!', 'success');
    return true;
  } catch (err) {
    if (notify) showToast('Failed to parse saved config: ' + err.message, 'error');
    return false;
  }
}

function autoLoadSavedConfig() {
  loadConfiguration(false);
}

function resetConfiguration() {
  if (confirm('Reset all field positions and typography settings to default?')) {
    localStorage.removeItem(STORAGE_KEY);
    state.hasCustomConfig = false;
    if (state.templateImage) {
      distributeDefaultCoordinates(DOM.canvas.width, DOM.canvas.height);
    }
    renderFieldPills();
    syncSettingsFormWithActiveField();
    renderCanvas();
    showToast('Configuration reset to defaults.', 'info');
  }
}

// ==========================================================================
// Batch Generation & Separate PDF Generation (jsPDF)
// ==========================================================================
function updateReadyStatus() {
  const hasTemplate = !!state.templateImage;
  const selectedStudents = state.students.filter(s => s.selected);
  const selectedCount = selectedStudents.length;

  DOM.btnSelectedCount.textContent = selectedCount;

  if (!hasTemplate) {
    DOM.readyStatusBadge.className = 'badge badge-warning';
    DOM.readyStatusBadge.textContent = 'Needs Template';
    DOM.btnGenerateAll.disabled = true;
  } else if (state.students.length === 0) {
    DOM.readyStatusBadge.className = 'badge badge-warning';
    DOM.readyStatusBadge.textContent = 'Needs Spreadsheet';
    DOM.btnGenerateAll.disabled = true;
  } else if (selectedCount === 0) {
    DOM.readyStatusBadge.className = 'badge badge-warning';
    DOM.readyStatusBadge.textContent = '0 Selected';
    DOM.btnGenerateAll.disabled = true;
  } else {
    DOM.readyStatusBadge.className = 'badge badge-success';
    DOM.readyStatusBadge.textContent = `Ready (${selectedCount})`;
    DOM.btnGenerateAll.disabled = false;
  }
}

/**
 * Critical Filename Formatter:
 * Requirements:
 * Do NOT use the student's name as the filename.
 * Use this format:
 * {Student Name}-Offer-Letter.pdf
 * Examples:
 * Neha Sharma-Offer-Letter.pdf
 * Mukesh Sharma-Offer-Letter.pdf
 * Anuj Kumar Dubey-Offer-Letter.pdf
 */
function getStudentFilename(student) {
  const cleanName = (student.name || 'Student')
    .replace(/[\\/:*?"<>|]/g, '') // Sanitize illegal filesystem characters
    .trim();
  return `${cleanName}-Offer-Letter.pdf`;
}

async function generateAllCertificates() {
  if (!state.templateImage) {
    showToast('Please upload a certificate template image first.', 'error');
    return;
  }

  const selectedStudents = state.students.filter(s => s.selected);
  if (selectedStudents.length === 0) {
    showToast('Please select at least one student from the table.', 'warning');
    return;
  }

  // Ensure jsPDF is loaded
  if (!window.jspdf || !window.jspdf.jsPDF) {
    showToast('jsPDF library is still loading or failed to load. Please refresh.', 'error');
    return;
  }

  state.isGenerating = true;
  state.generatedCertificates = [];
  DOM.btnGenerateAll.disabled = true;
  DOM.downloadAllSection.classList.add('hidden');
  DOM.progressSuccessAlert.classList.add('hidden');
  DOM.generationProgressContainer.classList.remove('hidden');

  const total = selectedStudents.length;
  let successful = 0;

  // Read selected quality scale (default 2.5 for 300 DPI Print Quality)
  let qualityScale = parseFloat(DOM.exportQualitySelect ? DOM.exportQualitySelect.value : 2.5) || 2.5;

  // Safeguard: Limit max dimension to 5000px to avoid browser canvas memory issues
  const maxDimension = 5000;
  if (DOM.canvas.width * qualityScale > maxDimension) {
    qualityScale = Math.max(1.0, maxDimension / DOM.canvas.width);
  }

  // Offscreen Canvas for Ultra-High Resolution (300 DPI) rendering
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = Math.round(DOM.canvas.width * qualityScale);
  offscreenCanvas.height = Math.round(DOM.canvas.height * qualityScale);
  const offscreenCtx = offscreenCanvas.getContext('2d');

  // Maximum quality image and text smoothing
  offscreenCtx.imageSmoothingEnabled = true;
  offscreenCtx.imageSmoothingQuality = 'high';
  if ('textRendering' in offscreenCtx) {
    offscreenCtx.textRendering = 'geometricPrecision';
  }

  const { jsPDF } = window.jspdf;
  const orientation = DOM.canvas.width >= DOM.canvas.height ? 'landscape' : 'portrait';

  for (let i = 0; i < total; i++) {
    const student = selectedStudents[i];

    // Update Progress UI
    const currentNum = i + 1;
    DOM.progressStatusText.textContent = `Generating certificate for ${student.name}...`;
    DOM.progressCountText.textContent = `${currentNum} / ${total}`;
    DOM.progressBarFill.style.width = `${Math.round((currentNum / total) * 100)}%`;

    try {
      // 1. Draw template background at supersampled canvas resolution
      offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      offscreenCtx.drawImage(state.templateImage, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

      // 2. Scale coordinate context so all field coordinates and fonts map 1:1, but rasterize at 300 DPI vector precision!
      offscreenCtx.save();
      offscreenCtx.scale(qualityScale, qualityScale);

      // Prepare student dynamic data
      const studentData = {
        student_name: student.name,
        internship: student.internship,
        offer_letter: student.offerLetter,
        issue_date: student.issueDate,
        start_date: student.startDate,
        end_date: student.endDate,
        duration: student.duration,
        mode: student.mode
      };

      // 3. Draw each enabled field with geometric precision
      Object.values(state.dynamicFields).forEach(field => {
        if (!field.enabled) return;
        const text = studentData[field.key] || '';
        if (!text) return;
        drawDynamicFieldText(offscreenCtx, field, text);
      });

      offscreenCtx.restore();

      // 4. Export Canvas to high-quality lossless PNG
      const pngDataUrl = offscreenCanvas.toDataURL('image/png', 1.0);

      // 5. Create a separate jsPDF Document matching exact template dimensions & aspect ratio
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: [DOM.canvas.width, DOM.canvas.height],
        hotfixes: ['px_scaling']
      });

      // Insert full-resolution 300 DPI image into PDF (using SLOW for lossless deflate)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(pngDataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'SLOW');

      // 6. Output as separate PDF Blob
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const filename = getStudentFilename(student);

      state.generatedCertificates.push({
        id: student.id,
        student: student,
        blob: pdfBlob,
        url: pdfUrl,
        filename: filename,
        status: 'Success'
      });

      student.status = 'Success';
      successful++;
    } catch (err) {
      console.error(`Error generating certificate for ${student.name}:`, err);
      student.status = 'Failed';
      state.generatedCertificates.push({
        id: student.id,
        student: student,
        blob: null,
        url: null,
        filename: getStudentFilename(student),
        status: 'Failed',
        error: err.message
      });
    }

    // Yield to browser execution to keep UI responsive & smooth
    await new Promise(resolve => setTimeout(resolve, 25));
  }

  // Generation Complete
  state.isGenerating = false;
  DOM.btnGenerateAll.disabled = false;
  DOM.progressStatusText.textContent = `All ${total} certificates generated!`;
  DOM.progressCountText.textContent = `${successful} / ${total}`;
  DOM.progressSuccessAlert.classList.remove('hidden');
  DOM.progressSuccessAlert.textContent = `✓ All ${successful} of ${total} certificates generated successfully.`;
  
  if (successful > 0) {
    DOM.downloadAllSection.classList.remove('hidden');
  }

  renderStudentsTable();
  renderGeneratedList();
  showToast(`Completed! ${successful} separate PDF certificates generated.`, 'success');
}

// Render Results List with individual [Preview] and [Download PDF] buttons
function renderGeneratedList() {
  const container = DOM.generatedListContainer;
  const countBadge = DOM.generatedCountBadge;

  countBadge.textContent = `${state.generatedCertificates.length} Ready`;

  if (state.generatedCertificates.length === 0) {
    container.innerHTML = `
      <div class="empty-list-placeholder">
        <p>No certificates generated yet.</p>
        <p class="sub">Click "Generate All Certificates" once template and data are ready.</p>
      </div>
    `;
    return;
  }

  let html = '';
  state.generatedCertificates.forEach((item, index) => {
    const isSuccess = item.status === 'Success';
    html += `
      <div class="generated-item">
        <div class="generated-item-left">
          <span class="generated-status-icon">${isSuccess ? '✓' : '✗'}</span>
          <div class="generated-details">
            <span class="generated-name">${escapeHtml(item.student.name)}</span>
            <span class="generated-sub">${escapeHtml(item.filename)}</span>
          </div>
        </div>
        <div class="generated-item-actions">
          ${isSuccess ? `
            <button class="btn btn-outline btn-sm btn-preview-cert" data-index="${index}">Preview</button>
            <button class="btn btn-primary btn-sm btn-download-cert" data-index="${index}">Download PDF</button>
          ` : `
            <span class="badge badge-warning">Failed</span>
          `}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add individual preview & download handlers
  container.querySelectorAll('.btn-preview-cert').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      const item = state.generatedCertificates[idx];
      if (item && item.url) {
        openPdfModal(item);
      }
    });
  });

  container.querySelectorAll('.btn-download-cert').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      const item = state.generatedCertificates[idx];
      if (item && item.blob) {
        downloadBlob(item.blob, item.filename);
      }
    });
  });
}

// ==========================================================================
// Download All Certificates Separately (NO ZIP, NO COMBINED MULTI-PAGE PDF)
// ==========================================================================
async function downloadAllCertificatesSeparately() {
  const validCerts = state.generatedCertificates.filter(c => c.status === 'Success' && c.blob);
  if (validCerts.length === 0) {
    showToast('No generated PDF files available to download.', 'warning');
    return;
  }

  showToast('Starting sequential downloads of separate PDFs. Please allow multiple downloads if prompted.', 'info');

  DOM.btnDownloadAllSeparately.disabled = true;
  const originalText = DOM.btnDownloadAllSeparately.innerHTML;

  for (let i = 0; i < validCerts.length; i++) {
    const cert = validCerts[i];
    DOM.btnDownloadAllSeparately.innerHTML = `Downloading ${i + 1} of ${validCerts.length}...`;
    downloadBlob(cert.blob, cert.filename);
    
    // Controlled delay (400ms) between downloads to prevent browser popup block
    await new Promise(resolve => setTimeout(resolve, 400));
  }

  DOM.btnDownloadAllSeparately.disabled = false;
  DOM.btnDownloadAllSeparately.innerHTML = originalText;
  showToast(`Finished downloading ${validCerts.length} separate PDF files.`, 'success');
}

// Download Helper
function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 250);
}

// ==========================================================================
// PDF Preview Modal
// ==========================================================================
let currentModalCert = null;

function openPdfModal(certItem) {
  currentModalCert = certItem;
  DOM.pdfModalTitle.textContent = `Certificate Preview — ${certItem.student.name}`;
  DOM.pdfModalFilename.textContent = certItem.filename;
  DOM.pdfModalFrame.src = certItem.url;
  DOM.pdfModal.classList.remove('hidden');

  DOM.btnModalDownload.onclick = () => {
    downloadBlob(certItem.blob, certItem.filename);
  };
}

function closePdfModal() {
  DOM.pdfModal.classList.add('hidden');
  DOM.pdfModalFrame.src = '';
  currentModalCert = null;
}

// ==========================================================================
// Demo Data & Sample Template Generator
// ==========================================================================
function loadDemoData() {
  // 1. Create a beautiful high-resolution sample CodeNova Certificate Background
  const demoCanvas = document.createElement('canvas');
  demoCanvas.width = 1920;
  demoCanvas.height = 1080;
  const dctx = demoCanvas.getContext('2d');

  // Background gradient
  const bgGrad = dctx.createLinearGradient(0, 0, 1920, 1080);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e1b4b');
  bgGrad.addColorStop(1, '#0f172a');
  dctx.fillStyle = bgGrad;
  dctx.fillRect(0, 0, 1920, 1080);

  // Elegant certificate borders
  dctx.strokeStyle = '#c7d2fe';
  dctx.lineWidth = 3;
  dctx.strokeRect(60, 60, 1800, 960);

  dctx.strokeStyle = '#fbbf24';
  dctx.lineWidth = 1.5;
  dctx.strokeRect(76, 76, 1768, 928);

  // Corner decorative flourishes
  drawCornerAccents(dctx, 76, 76, 1768, 928);

  // CodeNova Branding Header
  dctx.fillStyle = '#818cf8';
  dctx.font = '600 24px "Poppins", sans-serif';
  dctx.textAlign = 'center';
  dctx.letterSpacing = '6px';
  dctx.fillText('CODENOVA TECHNOLOGIES', 960, 180);

  // Main Certificate Title
  dctx.fillStyle = '#ffffff';
  dctx.font = '700 64px "Cinzel", "Playfair Display", serif';
  dctx.letterSpacing = '3px';
  dctx.fillText('CERTIFICATE OF INTERNSHIP', 960, 260);

  // Subtitle
  dctx.fillStyle = '#94a3b8';
  dctx.font = '400 20px "Poppins", sans-serif';
  dctx.letterSpacing = '1px';
  dctx.fillText('THIS CERTIFICATE IS PROUDLY PRESENTED TO', 960, 420);

  // Golden separator line under student name
  dctx.strokeStyle = '#e2e8f0';
  dctx.lineWidth = 1;
  dctx.beginPath();
  dctx.moveTo(560, 560);
  dctx.lineTo(1360, 560);
  dctx.stroke();

  // "for successfully completing the internship in"
  dctx.fillStyle = '#cbd5e1';
  dctx.font = '400 20px "Poppins", sans-serif';
  dctx.fillText('for successfully completing the specialized internship training in', 960, 600);

  // Period / Duration labels
  dctx.fillStyle = '#64748b';
  dctx.font = '500 16px "Poppins", sans-serif';
  dctx.fillText('START DATE', 680, 710);
  dctx.fillText('DURATION', 960, 710);
  dctx.fillText('END DATE', 1240, 710);
  dctx.fillText('INTERNSHIP MODE', 960, 785);

  // Golden Seal Badge on bottom left
  drawSealBadge(dctx, 320, 880);

  // Signature on bottom right
  dctx.strokeStyle = '#e2e8f0';
  dctx.beginPath();
  dctx.moveTo(1450, 890);
  dctx.lineTo(1750, 890);
  dctx.stroke();

  dctx.fillStyle = '#cbd5e1';
  dctx.font = '400 16px "Poppins", sans-serif';
  dctx.fillText('AUTHORIZED SIGNATORY', 1600, 920);

  dctx.fillStyle = '#fbbf24';
  dctx.font = 'italic 28px "Alex Brush", cursive';
  dctx.fillText('A. K. Dubey', 1600, 875);

  const demoPngDataUrl = demoCanvas.toDataURL('image/png');
  loadTemplateImageFromUrl(demoPngDataUrl, 'CodeNova-Internship-Template.png');

  // 2. Load Demo Students
  const sampleStudents = [
    {
      id: 1,
      name: 'Neha Sharma',
      internship: 'AI/ML',
      offerLetter: 'CN-OL-202',
      issueDate: '8 October 2026',
      startDate: '10 October 2026',
      endDate: '6 November 2026',
      duration: '4 Weeks',
      mode: 'Remote',
      selected: true,
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Mukesh Sharma',
      internship: 'AI/ML',
      offerLetter: 'CN-OL-203',
      issueDate: '8 October 2026',
      startDate: '10 October 2026',
      endDate: '6 November 2026',
      duration: '4 Weeks',
      mode: 'Remote',
      selected: true,
      status: 'Pending'
    },
    {
      id: 3,
      name: 'Pari Mehra',
      internship: 'Full Stack Web Development',
      offerLetter: 'CN-OL-204',
      issueDate: '8 October 2026',
      startDate: '10 October 2026',
      endDate: '6 November 2026',
      duration: '4 Weeks',
      mode: 'Remote',
      selected: true,
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Rani Singh',
      internship: 'Data Science & Analytics',
      offerLetter: 'CN-OL-205',
      issueDate: '8 October 2026',
      startDate: '10 October 2026',
      endDate: '6 November 2026',
      duration: '4 Weeks',
      mode: 'Remote',
      selected: true,
      status: 'Pending'
    },
    {
      id: 5,
      name: 'Alexander Bartholomew Christopher Montgomery', // Long name test
      internship: 'Cloud Architecture & DevOps',
      offerLetter: 'CN-OL-206',
      issueDate: '8 October 2026',
      startDate: '10 October 2026',
      endDate: '6 November 2026',
      duration: '4 Weeks',
      mode: 'Hybrid',
      selected: true,
      status: 'Pending'
    }
  ];

  state.students = sampleStudents;
  DOM.spreadsheetFileName.textContent = 'CodeNova-Sample-Students.xlsx';
  DOM.spreadsheetCount.textContent = `${sampleStudents.length} students`;
  DOM.spreadsheetFileInfo.classList.remove('hidden');
  DOM.importedSummaryText.textContent = `${sampleStudents.length} students imported`;
  DOM.tabStudentCount.textContent = sampleStudents.length;

  // Set field styles optimized for the dark demo template
  state.dynamicFields.student_name.color = '#fbbf24'; // Gold text
  state.dynamicFields.internship.color = '#a5b4fc';
  state.dynamicFields.offer_letter.color = '#94a3b8';
  state.dynamicFields.issue_date.color = '#94a3b8';
  state.dynamicFields.start_date.color = '#f1f5f9';
  state.dynamicFields.end_date.color = '#f1f5f9';
  state.dynamicFields.duration.color = '#fbbf24';
  state.dynamicFields.mode.color = '#34d399';

  populateStudentPreviewDropdown();
  renderStudentsTable();
  syncSettingsFormWithActiveField();
  updateReadyStatus();
  renderCanvas();

  showToast('Demo template and 5 student records loaded successfully!', 'success');
}

// Helper: Decorative Seal Badge
function drawSealBadge(ctx, cx, cy) {
  ctx.save();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(cx, cy, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '700 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VERIFIED', cx, cy - 8);
  ctx.font = '600 11px sans-serif';
  ctx.fillText('CERTIFIED', cx, cy + 10);
  ctx.restore();
}

// Helper: Corner Accents
function drawCornerAccents(ctx, x, y, w, h) {
  const size = 30;
  ctx.save();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(x + size, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + size);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(x + w - size, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + size);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(x + size, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h - size);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(x + w - size, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - size);
  ctx.stroke();

  ctx.restore();
}

// ==========================================================================
// Toast & Utility Helpers
// ==========================================================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
