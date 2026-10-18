import { Column, Host, Text } from "@expo/ui";

export default function Index() {
  return (
    <Host style={{ flex: 1 }} seedColor="#208AEF">
      <Column alignment="center" spacing={12} style={{ padding: 24 }}>
        <Text textStyle={{ fontSize: 28, fontWeight: "700" }}>Cashout</Text>
        <Text textStyle={{ fontSize: 16, textAlign: "center" }}>
          Your digital wallet for bottle deposit coupons.
        </Text>
      </Column>
    </Host>
  );
}
