package com;
import java.util.List;

import difflib.Delta;
import difflib.DiffUtils;
import difflib.Patch;

public class DiffLibrary {

	public Patch recieveFiles(final List<String> firstFileList, final List<String> secondFileList) {

		final Patch patch = DiffUtils.diff(firstFileList, secondFileList);
		for (Delta delta : patch.getDeltas()) {
			System.out.println(delta);
		}
		return patch;

	}

}