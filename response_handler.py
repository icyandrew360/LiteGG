import requests

from exceptions import UnauthorizedError, ForbiddenError, NotFoundError, GeneralAPIError


def handle_response(response):
    try:
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx and 5xx)
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 401:
            raise UnauthorizedError("Unauthorized access. Check your API key.")
        elif response.status_code == 403:
            raise ForbiddenError(
                "Forbidden access. You do not have permission to access this resource."
            )
        elif response.status_code == 404:
            raise NotFoundError("Resource not found. Check the PUUID and try again.")
        else:
            raise GeneralAPIError(f"HTTP error occurred: {http_err}")
    except Exception as err:
        raise GeneralAPIError(f"An error occurred: {err}")
    return response.json()
