import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  useTheme,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import type { MD3Theme } from "react-native-paper";
import { COMMON_BARCODE_FORMATS, BARCODE_FORMATS } from "@/constants";
import { isValidBarcodeValue } from "@/utils/barcode";
import { isValidAmount } from "@/utils/money";

interface CouponFormData {
  barcodeValue: string;
  barcodeFormat: string;
  amount: string;
  storeName: string;
  expiresAt: string;
  notes: string;
}

interface CouponFormProps {
  /** Initial values for the form (for edit mode or scanner prefill). */
  initialValues?: Partial<CouponFormData>;
  /** Whether the barcode value field is read-only (from scanner). */
  barcodeReadOnly?: boolean;
  /** Callback when the form is submitted with validated data. */
  onSubmit: (data: CouponFormData) => void;
  /** Whether the form is in a loading/submitting state. */
  loading?: boolean;
  /** Label for the submit button. */
  submitLabel?: string;
}

/**
 * Reusable coupon entry/edit form with validation.
 * Used by both the Add and Edit coupon screens.
 */
export function CouponForm({
  initialValues,
  barcodeReadOnly = false,
  onSubmit,
  loading = false,
  submitLabel = "Save Coupon",
}: CouponFormProps) {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);

  const [barcodeValue, setBarcodeValue] = useState(
    initialValues?.barcodeValue ?? "",
  );
  const [barcodeFormat, setBarcodeFormat] = useState(
    initialValues?.barcodeFormat ?? "code128",
  );
  const [amount, setAmount] = useState(initialValues?.amount ?? "");
  const [storeName, setStoreName] = useState(initialValues?.storeName ?? "");
  const [expiresAt, setExpiresAt] = useState(initialValues?.expiresAt ?? "");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // Validation
  const barcodeError =
    touched.barcodeValue && !isValidBarcodeValue(barcodeValue);
  const amountError = touched.amount && !isValidAmount(amount);

  const isFormValid =
    isValidBarcodeValue(barcodeValue) && isValidAmount(amount);

  const handleSubmit = () => {
    setTouched({
      barcodeValue: true,
      amount: true,
    });

    if (!isFormValid) return;

    onSubmit({
      barcodeValue,
      barcodeFormat,
      amount,
      storeName,
      expiresAt,
      notes,
    });
  };

  const formatButtons = COMMON_BARCODE_FORMATS.map((fmt) => ({
    value: fmt,
    label: BARCODE_FORMATS[fmt] ?? fmt,
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="labelLarge" style={styles.sectionLabel}>
        Barcode
      </Text>

      <TextInput
        label="Barcode Value"
        value={barcodeValue}
        onChangeText={setBarcodeValue}
        onBlur={() => markTouched("barcodeValue")}
        editable={!barcodeReadOnly}
        mode="outlined"
        error={barcodeError}
        style={styles.input}
        left={<TextInput.Icon icon="barcode" />}
        autoCapitalize="none"
      />
      {barcodeError ? (
        <HelperText type="error" visible>
          Barcode value is required
        </HelperText>
      ) : null}

      <Text variant="labelMedium" style={styles.fieldLabel}>
        Barcode Format
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <SegmentedButtons
          value={barcodeFormat}
          onValueChange={setBarcodeFormat}
          buttons={formatButtons}
          style={styles.segmentedButtons}
        />
      </ScrollView>

      <View style={styles.divider} />

      <Text variant="labelLarge" style={styles.sectionLabel}>
        Details
      </Text>

      <TextInput
        label="Amount (€)"
        value={amount}
        onChangeText={setAmount}
        onBlur={() => markTouched("amount")}
        mode="outlined"
        error={amountError}
        style={styles.input}
        keyboardType="decimal-pad"
        left={<TextInput.Icon icon="currency-eur" />}
        placeholder="e.g., 1.25"
      />
      {amountError ? (
        <HelperText type="error" visible>
          Enter a valid amount (e.g., 1.25)
        </HelperText>
      ) : null}

      <TextInput
        label="Store Name (optional)"
        value={storeName}
        onChangeText={setStoreName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="store" />}
        placeholder="e.g., REWE, Lidl"
      />

      <TextInput
        label="Expiry Date (optional)"
        value={expiresAt}
        onChangeText={setExpiresAt}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="calendar" />}
        placeholder="YYYY-MM-DD"
      />

      <TextInput
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={3}
        left={<TextInput.Icon icon="note-text" />}
        placeholder="Any additional notes..."
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        contentStyle={styles.submitButtonContent}
        icon="content-save"
      >
        {submitLabel}
      </Button>
    </ScrollView>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 32,
      gap: 4,
    },
    sectionLabel: {
      color: theme.colors.primary,
      marginTop: 8,
      marginBottom: 8,
      fontWeight: "600",
    },
    fieldLabel: {
      color: theme.colors.onSurfaceVariant,
      marginTop: 8,
      marginBottom: 4,
    },
    input: {
      marginBottom: 4,
    },
    segmentedButtons: {
      marginBottom: 8,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.outlineVariant,
      marginVertical: 16,
    },
    submitButton: {
      marginTop: 24,
      borderRadius: theme.roundness,
    },
    submitButtonContent: {
      paddingVertical: 6,
    },
  });
