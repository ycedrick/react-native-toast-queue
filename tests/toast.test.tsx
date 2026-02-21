import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { ToastProvider, useToast, ToastContextType } from "../src/toast";
import { Text, Button, View } from "react-native";

// Mock Timer
jest.useFakeTimers();

// Mock Component to trigger toasts
const TestComponent = () => {
  const { show, clear } = useToast();

  return (
    <View>
      <Button
        title="Show Success"
        onPress={() =>
          show({ message: "Success!", type: "success", duration: 1000 })
        }
      />
      <Button
        title="Show Error"
        onPress={() =>
          show({ message: "Error!", type: "error", duration: 1000 })
        }
      />
      <Button title="Clear" onPress={clear} />
    </View>
  );
};

const App = () => (
  <ToastProvider>
    <TestComponent />
  </ToastProvider>
);

describe("Toast Queue System", () => {
  it("renders without crashing", () => {
    render(<App />);
  });

  it("shows a toast when requested", async () => {
    const { getByText, queryByText } = render(<App />);

    fireEvent.press(getByText("Show Success"));

    // Should be visible
    expect(getByText("Success!")).toBeTruthy();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000); // Trigger internal timer
    });

    // Wait for exit animation (approx 250ms)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should disappear
    await waitFor(() => {
      expect(queryByText("Success!")).toBeNull();
    });
  });

  it("queues multiple toasts", async () => {
    const { getByText, queryByText } = render(<App />);

    // Trigger two toasts
    fireEvent.press(getByText("Show Success"));
    fireEvent.press(getByText("Show Error"));

    // Only first should be visible
    expect(getByText("Success!")).toBeTruthy();
    expect(queryByText("Error!")).toBeNull();

    // Dismiss first
    act(() => {
      jest.advanceTimersByTime(1300); // 1000 duration + 300 animation
    });

    // First gone, second appears
    await waitFor(() => {
      expect(queryByText("Success!")).toBeNull();
      expect(getByText("Error!")).toBeTruthy();
    });

    // Dismiss second
    act(() => {
      jest.advanceTimersByTime(1300);
    });

    await waitFor(() => {
      expect(queryByText("Error!")).toBeNull();
    });
  });

  it("clears the queue", async () => {
    const { getByText, queryByText } = render(<App />);

    fireEvent.press(getByText("Show Success"));
    fireEvent.press(getByText("Show Error"));

    expect(getByText("Success!")).toBeTruthy();

    fireEvent.press(getByText("Clear"));

    await waitFor(() => {
      expect(queryByText("Success!")).toBeNull();
      expect(queryByText("Error!")).toBeNull();
    });
  });
});
