import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "../App";

// MOCK DATA
const mockMoviesResponse = {
  Response: "True",
  Search: [
    {
      imdbID: "tt0372784",
      Title: "Batman Begins",
      Year: "2005",
      Poster: "https://via.placeholder.com/150",
      Director: "Christopher Nolan",
    },
    {
      imdbID: "tt1877830",
      Title: "The Batman",
      Year: "2022",
      Poster: "N/A",
      Director: "Matt Reeves",
    },
  ],
};

describe("Integração: Fluxo de Busca de Filmes", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMoviesResponse),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Deve buscar filmes e exibir os resultados corretamente", async () => {
    render(<App />);

    expect(
      screen.getByText(/FilmSearch - Movie Search Engine/i)
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Ex: Superman, Dune, Batman.../i);
    const button = screen.getByRole("button", { name: /Buscar Filmes/i });

    fireEvent.change(input, { target: { value: "Batman" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();

      expect(screen.getByText("Batman Begins")).toBeInTheDocument();
      expect(screen.getByText("The Batman")).toBeInTheDocument();
    });
  });
});
