import { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCsv, type ImportResult } from '../../utils/csvImport';
import { useExpenseStore } from '../../app/store/useExpenseStore';
import { parseLocalDate } from '../../utils/dateUtils';
import Modal from './Modal';
import styles from './ImportModal.module.scss';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { importExpenses } = useExpenseStore();
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setResult(null);
    setFileName('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setResult({ valid: [], errors: [{ row: 0, message: 'File must be a .csv' }] });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResult({ valid: [], errors: [{ row: 0, message: 'File is too large (max 5 MB)' }] });
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResult(parseCsv(text));
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleConfirm = () => {
    if (!result || result.valid.length === 0) return;
    importExpenses(result.valid);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import expenses">
      <div className={styles.content}>
        {!result ? (
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud size={32} className={styles.dropIcon} />
            <p className={styles.dropTitle}>Drop a CSV file here</p>
            <p className={styles.dropSub}>or click to browse</p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className={styles.hiddenInput}
              onChange={handleFileInput}
            />
          </div>
        ) : (
          <div className={styles.preview}>
            <p className={styles.fileName}>{fileName}</p>

            {result.errors.length > 0 && (
              <div className={styles.errorList}>
                <div className={styles.errorHeader}>
                  <AlertCircle size={14} />
                  <span>{result.errors.length} error{result.errors.length !== 1 ? 's' : ''}</span>
                </div>
                {result.errors.map((err, i) => (
                  <p key={i} className={styles.errorRow}>{err.message}</p>
                ))}
              </div>
            )}

            {result.valid.length > 0 ? (
              <>
                <div className={styles.successHeader}>
                  <CheckCircle size={14} />
                  <span>{result.valid.length} row{result.valid.length !== 1 ? 's' : ''} ready to import</span>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.valid.slice(0, 10).map((row) => (
                        <tr key={row.id}>
                          <td>{row.title}</td>
                          <td>${row.amount.toFixed(2)}</td>
                          <td>{row.category}</td>
                          <td>{parseLocalDate(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.valid.length > 10 && (
                    <p className={styles.moreRows}>…and {result.valid.length - 10} more</p>
                  )}
                </div>
              </>
            ) : (
              <p className={styles.noValid}>No valid rows to import.</p>
            )}

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={reset}>
                Choose different file
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirm}
                disabled={result.valid.length === 0}
              >
                Import {result.valid.length} expense{result.valid.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        <p className={styles.formatHint}>
          Expected columns: <code>id, title, amount, category, date, notes, recurring</code>
        </p>
      </div>
    </Modal>
  );
}
